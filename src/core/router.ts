import { authenticate } from 'core/hooks/authenticate';
import { handleErrors } from 'core/hooks/errors';
import {
  releaseTenantDataConnection,
  setupTenantStorage,
} from 'core/hooks/storage';
import {
  releaseTenantRegistryConnection,
  setupTenantRegistry,
} from 'core/hooks/tenantRegistry';
import { ErrorParser } from 'core/types';
import { DBContext } from 'database/types';
import { FastifyPluginCallback } from 'fastify';
import { PoolClient } from 'pg';
import { authenticated, unauthenticated } from './../routes';
import { throttle } from './hooks/limit';

declare module 'fastify' {
  interface FastifyRequest {
    tenantStorage: DBContext;
    tenantRegistry: DBContext;
    tenantDataConnection: null | PoolClient;
    tenantRegistryConnection: null | PoolClient;
    error: ErrorParser;
  }
  interface FastifyError {
    publicMessage: string;
  }
}

export const authenticatedRoutes: FastifyPluginCallback = (app, opts, done) => {
  /* Protect internal api routes using cookie/session
     stored in redis */
  app.decorateRequest('error', null);
  app.decorateRequest('tenantStorage', null);
  app.decorateRequest('tenantRegistry', null);
  app.decorateRequest('tenantDataConnection', null);
  app.decorateRequest('tenantRegistryConnection', null);

  app.addHook('onRequest', handleErrors);
  app.addHook('onRequest', authenticate);
  app.addHook('onRequest', setupTenantRegistry);
  app.addHook('onRequest', setupTenantStorage);
  app.addHook('onResponse', releaseTenantDataConnection);
  app.addHook('onResponse', releaseTenantRegistryConnection);

  // Configure internal protected routes
  authenticated(app);
  done();
};

export const unauthenticatedRoutes: FastifyPluginCallback = (
  app,
  opts,
  done
) => {
  app.decorateRequest('error', null);
  app.decorateRequest('tenantRegistryConnection', null);
  app.addHook('onRequest', throttle);
  app.addHook('onRequest', handleErrors);
  app.addHook('onRequest', setupTenantRegistry);
  app.addHook('onResponse', releaseTenantRegistryConnection);

  //Configure public unauthenticated routes
  unauthenticated(app);
  done();
};
