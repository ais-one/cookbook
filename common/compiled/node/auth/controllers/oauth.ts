import type { Request, Response } from 'express';
import { createToken, setTokensToHeader } from '../jwt.ts';
import { findUser } from '../store.ts';

const { AUTH_ERROR_URL } = globalThis.__config;
const OAUTH_OPTIONS = globalThis.__config?.OAUTH_OPTIONS || {};

// set callback URL on github to <schema://host:port>/api/oauth/callback
// initiated from browser - window.location.replace('https://github.com/login/oauth/authorize?scope=user:email&client_id=XXXXXXXXXXXXXXXXXXXX')

/**
 * OAuth callback handler — exchanges the authorization code for an access token,
 * fetches the OAuth provider's user profile, matches it to a local user, then
 * issues JWT tokens and redirects back to the client.
 *
 * Mounted at: GET /oauth/callback
 */
export const callbackOAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, state } = req.query;
    const result = await fetch(OAUTH_OPTIONS.URL, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: OAUTH_OPTIONS.CLIENT_ID,
        client_secret: OAUTH_OPTIONS.CLIENT_SECRET,
        code,
        state,
      }),
    });
    const data = await result.json();
    if (data.access_token) {
      const resultUser = await fetch(OAUTH_OPTIONS.USER_URL, {
        method: 'GET',
        headers: { Authorization: `token ${data.access_token}` },
      });
      const oauthUser = await resultUser.json();
      const oauthId = oauthUser[OAUTH_OPTIONS.USER_ID];

      const user = await findUser({ [OAUTH_OPTIONS.FIND_ID]: oauthId });
      if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { id, roles } = user;
      const tokens = await createToken({ sub: id, roles: roles.split(',') });
      setTokensToHeader(res, tokens);
      res.redirect(
        `${OAUTH_OPTIONS.CALLBACK}#${tokens.access_token};${tokens.refresh_token};${JSON.stringify(tokens.user_meta)}`,
      );
      return;
    }
    res.status(401).json({ message: 'Missing Token' });
  } catch (_e) {
    AUTH_ERROR_URL ? res.redirect(AUTH_ERROR_URL) : res.status(401).json({ error: 'NOT Authenticated' });
  }
};
