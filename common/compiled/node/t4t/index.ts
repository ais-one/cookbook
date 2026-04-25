import type { Application, NextFunction, Request, Response } from 'express';
import express from 'express';
import t4t from './t4t.ts';

// export your routes here - make sure no clashes
function mockAuthUser(req: Request, _res: Response, next: NextFunction): void {
  logger.info('WARNING Auth bypass in t4t.ts');
  req.user = {
    sub: 'testuser',
    roles: ['admin', 'editor', 'viewer'], // rename to roles?
    tenant_id: undefined, // for filtering by organization
  };
  next();
}

const router = express.Router();

export default ({ app, routePrefix }: { app: Application; routePrefix: string }): void => {
  app.use(routePrefix, router.use('/', t4t({ authFunc: mockAuthUser })));
};
