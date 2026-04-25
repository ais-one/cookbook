import { randomUUID } from 'node:crypto';
import fs from 'node:fs'; // for HTTPS with valid CA certs
import https from 'node:https';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import { z } from 'zod';

import initTools from './tools/index.js';

const app = express();
app.use(express.json());

// Store active transports keyed by session ID
const transports = new Map();

// Factory: create a fresh McpServer with all tools registered
function createMcpServer(initialHeaders) {
  const server = new McpServer({
    name: 'my-remote-server',
    version: '1.0.0',
  });

  // --- Tool: add ---
  server.tool('add', 'Add two numbers', { a: z.number(), b: z.number() }, async ({ a, b }) => ({
    content: [{ type: 'text', text: String(a + b) }],
  }));

  // --- Tool: greet ---
  server.tool('greet', 'Return a greeting', { name: z.string() }, async ({ name }) => ({
    content: [{ type: 'text', text: `Hello, ${name}! 👋` }],
  }));

  // --- Tool: random ---
  server.tool(
    'random',
    'Return a random number between min and max',
    { min: z.number(), max: z.number() },
    async ({ min, max }) => ({
      content: [
        {
          type: 'text',
          text: String(Math.floor(Math.random() * (max - min + 1)) + min),
        },
      ],
    }),
  );

  initTools(server, initialHeaders);

  // --- Resource ---
  server.resource('server-info', 'info://server', { mimeType: 'text/plain' }, async () => ({
    contents: [
      {
        uri: 'info://server',
        text: 'My Remote MCP Server v1.0 — Streamable HTTP',
      },
    ],
  }));

  // server.resource('config', 'config://app', async uri => {
  //   return {
  //     contents: [{ uri: uri.href, text: 'App configuration here' }],
  //   };
  // });

  // server.resource(
  //   'user-profile',
  //   new ResourceTemplate('users://{userId}/profile', { list: undefined }),
  //   async (uri, { userId }) => {
  //     return {
  //       contents: [{ uri: uri.href, text: `Profile data for user ${userId}` }],
  //     };
  //   },
  // );

  // server.prompt('review-code', { code: z.string() }, ({ code }) => {
  //   return {
  //     messages: [
  //       {
  //         role: 'user',
  //         content: {
  //           type: 'text',
  //           text: `Please review this code:\n\n${code}`,
  //         },
  //       },
  //     ],
  //   };
  // });

  return server;
}

// ─── MCP Endpoint ──────────────────────────────────────────────────────────

// POST /mcp — handle all client messages
app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'];
  let transport;

  if (sessionId && transports.has(sessionId)) {
    // Reuse existing session
    transport = transports.get(sessionId);
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New session — create transport + server
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: id => {
        transports.set(id, transport);
        // console.log(`[session] created: ${id}`);
      },
    });

    transport.onclose = () => {
      const id = transport.sessionId;
      transports.delete(id);
      // console.log(`[session] closed: ${id}`);
    };

    const initialHeaders = { ...req.headers }; // for auth or other context in tools
    const server = createMcpServer(initialHeaders);
    await server.connect(transport);
  } else {
    res.status(400).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Missing or invalid session' }, id: null });
    return;
  }

  await transport.handleRequest(req, res, req.body);
});

// GET /mcp — open SSE stream for server-to-client notifications
app.get('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'];
  const transport = transports.get(sessionId);

  if (!transport) {
    res.status(404).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Session not found' }, id: null });
    return;
  }

  await transport.handleRequest(req, res);
});

// DELETE /mcp — terminate a session
app.delete('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'];
  const transport = transports.get(sessionId);

  if (!transport) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  await transport.handleRequest(req, res);
});

// ─── Start ─────────────────────────────────────────────────────────────────

app.get('/status', (req, res) => res.send('OK - 0.6'));

const PORT = process.env.API_PORT || 443;

if (process.env.HTTPS) {
  const privateKey = fs.readFileSync('pems/abc.key', 'utf8');
  const certificate = fs.readFileSync('pems/abc.cert', 'utf8');
  const credentials = { key: privateKey, cert: certificate };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(PORT, () => {});
} else {
  app.listen(PORT, () => {});
}
