import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createToken, setTokensToHeader } from '../jwt.ts';

const { AUTH_ERROR_URL } = globalThis.__config;
const OIDC_OPTIONS = globalThis.__config?.OIDC_OPTIONS || {};

const AUTH_URL = OIDC_OPTIONS ? `${OIDC_OPTIONS.URL}/auth?` : '';
const TOKEN_URL = OIDC_OPTIONS ? `${OIDC_OPTIONS.URL}/token` : '';

/**
 * Redirect the user to the OIDC provider's authorization endpoint.
 * Mounted at: GET /oidc/login
 */
export const login = async (_req: Request, res: Response): Promise<void> => {
  const payload = new URLSearchParams();
  payload.append('response_type', 'code');
  payload.append('client_id', OIDC_OPTIONS.CLIENT_ID);
  if (OIDC_OPTIONS.CLIENT_SECRET) payload.append('client_secret', OIDC_OPTIONS.CLIENT_SECRET);
  res.redirect(AUTH_URL + payload.toString());
};

/**
 * OIDC authorization code callback — exchanges the code for tokens.
 * When REISSUE is enabled, decodes the OIDC access token and re-issues a local JWT.
 * Mounted at: GET /oidc/auth
 */
export const auth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query;
    let payload =
      `grant_type=authorization_code&code=${code}` +
      `&redirect_uri=${OIDC_OPTIONS.CALLBACK}&client_id=${OIDC_OPTIONS.CLIENT_ID}`;
    if (OIDC_OPTIONS.CLIENT_SECRET) payload += `&client_secret=${OIDC_OPTIONS.CLIENT_SECRET}`;

    const result = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload,
    });
    const data = await result.json();
    let { access_token, refresh_token, ...user_meta } = data;

    if (OIDC_OPTIONS.REISSUE) {
      const user = jwt.decode(access_token) as Record<string, unknown>;
      user.sub = user[OIDC_OPTIONS.ID_NAME];
      user.roles = (user.resource_access as Record<string, { roles: string[] }>).account.roles;
      const tokens = await createToken(user);
      access_token = tokens.access_token;
      refresh_token = tokens.refresh_token;
    }
    res.redirect(`${OIDC_OPTIONS.CALLBACK}#${access_token};${refresh_token};${JSON.stringify(user_meta)}`);
  } catch (_e) {
    AUTH_ERROR_URL ? res.redirect(AUTH_ERROR_URL) : res.status(401).json({ error: 'NOT Authenticated' });
  }
};

/**
 * Refresh the OIDC access token using the stored refresh token.
 * Mounted at: GET /oidc/refresh
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refresh_token || req.header('refresh_token') || req.query?.refresh_token;
  const payload = new URLSearchParams();
  payload.append('grant_type', 'refresh_token');
  payload.append('refresh_token', refreshToken);
  payload.append('client_id', OIDC_OPTIONS.CLIENT_ID);
  if (OIDC_OPTIONS.CLIENT_SECRET) payload.append('client_secret', OIDC_OPTIONS.CLIENT_SECRET);

  const result = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload.toString(),
  });
  const data = await result.json();
  const tokens = { access_token: data.access_token, refresh_token: data.refresh_token ?? refreshToken };
  setTokensToHeader(res, tokens);
  res.json(tokens);
};
