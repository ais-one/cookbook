import '@common/node/config';
import '@common/node/logger';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import http from 'node:http';
import { createRequire } from 'node:module';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import express from 'express';

// ─── Constants ────────────────────────────────────────────────────────────────

const IDP_PORT = 7000;
const IDP_URL = `http://127.0.0.1:${IDP_PORT}`;
const SP_ENTITY_ID = 'http://127.0.0.1:3001/saml';
const SP_CALLBACK = 'http://127.0.0.1:3001/api/saml/callback';
const APP_PORT = 3001;
const APP_BASE_URL = `http://127.0.0.1:${APP_PORT}`;

// ─── Resolve saml-idp paths ───────────────────────────────────────────────────

const _require = createRequire(import.meta.url);
const samlIdpDir = path.dirname(_require.resolve('saml-idp/package.json'));
const samlIdpBin = path.join(samlIdpDir, 'bin', 'run.js');
const certPath = path.join(samlIdpDir, 'test', 'test-public-cert.pem');
const keyPath = path.join(samlIdpDir, 'test', 'test-private-key.pem');
const idpCert = readFileSync(certPath, 'utf8');

// ─── Config override (before module import) ───────────────────────────────────
// biome-ignore lint/suspicious/noExplicitAny: test config override
(globalThis as any).__config = {
  // biome-ignore lint/suspicious/noExplicitAny: spreading frozen config object
  ...(globalThis as any).__config,
  AUTH_ERROR_URL: undefined,
  SAML_OPTIONS: {
    entryPoint: `${IDP_URL}/saml/sso`,
    issuer: SP_ENTITY_ID,
    callbackUrl: SP_CALLBACK,
    idpCert,
    wantAssertionsSigned: true,
    disableRequestedAuthnContext: true,
  },
  SAML_JWT_MAP: { id: 'nameID', groups: 'groups' },
};

const { login, auth } = await import('@common/node/auth/controllers/saml');

// ─── HTTP helper ──────────────────────────────────────────────────────────────

type HttpResponse = { status: number; headers: http.IncomingHttpHeaders; body: string };

function httpRequest(
  url: string,
  options: { method?: string; headers?: Record<string, string>; body?: string } = {},
): Promise<HttpResponse> {
  return new Promise((resolve, reject) => {
    const { hostname, port, pathname, search } = new URL(url);
    const bodyBuf = options.body ? Buffer.from(options.body) : null;
    const req = http.request(
      {
        hostname,
        port: Number(port) || 80,
        path: pathname + search,
        method: options.method ?? 'GET',
        headers: { ...options.headers, ...(bodyBuf ? { 'Content-Length': bodyBuf.length } : {}) },
      },
      res => {
        let data = '';
        res.on('data', (chunk: Buffer) => {
          data += chunk.toString();
        });
        res.on('end', () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body: data }));
      },
    );
    req.on('error', reject);
    if (bodyBuf) req.write(bodyBuf);
    req.end();
  });
}

// ─── SAML session — maintains cookies and follows redirects ───────────────────

class SamlSession {
  private readonly jar = new Map<string, string>();

  private update(headers: http.IncomingHttpHeaders): void {
    for (const cookie of headers['set-cookie'] ?? []) {
      const [pair] = cookie.split(';');
      const eq = pair.indexOf('=');
      if (eq !== -1) this.jar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
    }
  }

  private cookieHeader(): string {
    return [...this.jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
  }

  async get(url: string): Promise<HttpResponse> {
    const headers: Record<string, string> = {};
    if (this.jar.size) headers.Cookie = this.cookieHeader();
    const res = await httpRequest(url, { headers });
    this.update(res.headers);
    return res;
  }

  async post(url: string, body: string): Promise<HttpResponse> {
    const headers: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded' };
    if (this.jar.size) headers.Cookie = this.cookieHeader();
    const res = await httpRequest(url, { method: 'POST', headers, body });
    this.update(res.headers);
    return res;
  }

  async follow(url: string, depth = 0): Promise<HttpResponse> {
    if (depth > 8) throw new Error(`Too many redirects from ${url}`);
    const res = await this.get(url);
    if ((res.status === 301 || res.status === 302 || res.status === 303) && res.headers.location) {
      return this.follow(new URL(res.headers.location as string, url).toString(), depth + 1);
    }
    return res;
  }
}

// ─── HTML form field helpers ──────────────────────────────────────────────────

function extractFormAction(html: string): string {
  return html.match(/<form[^>]*action=["']([^"']+)["']/i)?.[1] ?? '';
}

// Extract all submittable fields from an HTML form (inputs + selects)
function extractAllFormFields(html: string): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const m of html.matchAll(/<input([^>]+?)(?:\s*\/)?>/gi)) {
    const tag = m[1];
    const type = /\btype=["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase();
    if (type === 'submit' || type === 'button' || type === 'reset' || type === 'image') continue;
    const name = /\bname=["']([^"']+)["']/i.exec(tag)?.[1];
    const value = /\bvalue=["']([^"']*?)["']/i.exec(tag)?.[1] ?? '';
    if (name) fields[name] = value;
  }
  // selects: use first option as the default submitted value
  for (const m of html.matchAll(/<select[^>]+?name=["']([^"']+)["'][^>]*?>([\s\S]*?)<\/select>/gi)) {
    const firstOpt = /<option[^>]*?>([^<]*?)<\/option>/i.exec(m[2])?.[1]?.trim() ?? '';
    fields[m[1]] = firstOpt;
  }
  return fields;
}

// ─── Poll until a URL returns 200 ────────────────────────────────────────────

async function waitForUrl(url: string, maxAttempts = 20, delayMs = 500): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await httpRequest(url);
      if (res.status === 200) return;
    } catch {
      // not ready yet
    }
    await new Promise(r => setTimeout(r, delayMs));
  }
  throw new Error(`Server did not become ready at ${url} after ${maxAttempts * delayMs}ms`);
}

// ─── Simulate the full SAML SP-initiated login flow ──────────────────────────
// Returns the IdP's auto-submit HTML page containing the signed SAMLResponse.

async function getSamlResponseHtml(relayState = ''): Promise<string> {
  const session = new SamlSession();

  // Step 1: GET SP login → redirect to saml-idp SSO URL with SAMLRequest
  const qs = relayState ? `?RelayState=${encodeURIComponent(relayState)}` : '';
  const spLoginRes = await httpRequest(`${APP_BASE_URL}/api/saml/login${qs}`);
  const idpSsoUrl = spLoginRes.headers.location as string;
  if (!idpSsoUrl) throw new Error('SP /api/saml/login did not redirect to IdP');

  // Step 2: GET IdP SSO URL → user attribute form (no credentials — saml-idp pre-fills a test user)
  const idpFormRes = await session.follow(idpSsoUrl);
  const formAction = extractFormAction(idpFormRes.body);
  const formFields = extractAllFormFields(idpFormRes.body);
  if (!formFields._authnRequest) throw new Error('Could not find _authnRequest in saml-idp form');

  // Step 3: POST all form fields to /signin → samlresponse.hbs with signed SAMLResponse
  const signInUrl = new URL(formAction, IDP_URL).toString();
  return (await session.post(signInUrl, new URLSearchParams(formFields).toString())).body;
}

// ─── Test server + saml-idp process lifecycle ─────────────────────────────────

let appServer: http.Server;
// biome-ignore lint/suspicious/noExplicitAny: child process type
let idpProcess: any;

before(async () => {
  idpProcess = spawn(
    process.execPath,
    [
      samlIdpBin,
      '--host',
      '127.0.0.1',
      '--port',
      String(IDP_PORT),
      '--key',
      keyPath,
      '--cert',
      certPath,
      '--acsUrl',
      SP_CALLBACK,
      '--audience',
      SP_ENTITY_ID,
      '--issuer',
      `${IDP_URL}/metadata`,
    ],
    { stdio: 'pipe' },
  );

  await waitForUrl(`${IDP_URL}/metadata`);

  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.get('/api/saml/login', login);
  app.post('/api/saml/callback', auth);

  await new Promise<void>(resolve => {
    appServer = app.listen(APP_PORT, '127.0.0.1', () => resolve());
  });
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    appServer.close(err => (err ? reject(err) : resolve()));
  });
  idpProcess.kill();
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe.skip('SAML — GET /api/saml/login', () => {
  it.only('redirects to saml-idp SSO endpoint with SAMLRequest', async () => {
    const { status, headers } = await httpRequest(`${APP_BASE_URL}/api/saml/login`);
    assert.strictEqual(status, 302);
    const location = (headers.location as string) ?? '';
    assert.ok(location.startsWith(`${IDP_URL}/saml/sso`), `Expected saml-idp SSO redirect, got: ${location}`);
    assert.ok(location.includes('SAMLRequest='), 'Expected SAMLRequest param in redirect URL');
  });
});

describe.skip('SAML — POST /api/saml/callback', () => {
  it.only('returns authenticated user data when SAMLResponse is valid and RelayState is absent', async () => {
    const samlFormHtml = await getSamlResponseHtml();
    // Extract SAMLResponse from the IdP's auto-submit form
    const r1 = /name=["']SAMLResponse["'][^>]*value=["']([^"']*?)["']/i;
    const r2 = /value=["']([^"']*?)["'][^>]*name=["']SAMLResponse["']/i;
    const samlResponse = (samlFormHtml.match(r1) ?? samlFormHtml.match(r2))?.[1] ?? '';
    assert.ok(samlResponse, 'Expected SAMLResponse hidden input in IdP auto-submit form');

    const { status, body } = await httpRequest(`${APP_BASE_URL}/api/saml/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ SAMLResponse: samlResponse }).toString(),
    });
    assert.strictEqual(status, 200);
    const data = JSON.parse(body) as { authenticated: boolean; user: { sub: unknown; roles: unknown } };
    assert.strictEqual(data.authenticated, true);
    assert.ok(data.user, 'Response should contain user object');
  });
});
