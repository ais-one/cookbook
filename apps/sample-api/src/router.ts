import t4tRoutes from '@common/node/t4t/index';
import express from 'express';
import * as auth from './auth/routes.ts';
import base from './base/routes.ts';
import fido from './fido/routes.ts';
import permissionsRoute from './permissions/generated/routes.ts';
import rolesRoute from './roles/generated/routes.ts';
import sse from './sse/routes.ts';
import tests from './tests/routes.ts';
import usersRoute from './users/generated/routes.ts';
import webhooks from './webhooks/routes.ts';
import webpush from './webpush/routes.ts';

// Generated CRUD routes — add mounts below after `npm run generate:crud`
// Example: import categoriesRoute from './categories/generated/routes.ts';

const router = express.Router();

// export your routes here - make sure no clashes
export default ({ app }) => {
  app.use(
    '/api/sample-api',
    router.use('/', base), // http://127.0.0.1:3000/api/sample-api/
    router.use('/users', usersRoute), // http://127.0.0.1:3000/api/sample-api/users/
    router.use('/roles', rolesRoute), // http://127.0.0.1:3000/api/sample-api/roles/
    router.use('/permissions', permissionsRoute), // http://127.0.0.1:3000/api/sample-api/permissions/
    router.use('/webhooks', webhooks),
    router.use('/sse', sse),
    router.use('/tests', tests), // for tests
    router.use('/webpush', webpush),
    router.use('/fido', fido),
  );

  t4tRoutes({ app, routePrefix: '/api/t4t' }); // http://127.0.0.1:3000/api/t4t/

  // authentication stuff Below - you can remove if not needed (be aware of routing if you are customizing your auth)
  // routes used are: /api/auth (own auth rollout), /api/oauth, /api/oidc, /api/saml
  // this one can actually be a microservice on its own, but for demo purposes we are putting it here
  app.use(
    '/api',
    router.use('/auth', auth.myauthRoute),
    router.use('/oidc', auth.oidcRoute),
    router.use('/oauth', auth.oauthRoute),
    router.use('/saml', auth.samlRoute),
  );
};
