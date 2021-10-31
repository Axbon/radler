import { SAAS_DB_SECRET, TENANTS_DATA_HOSTS_PORT } from 'core/env';
import { getTenantsQueryAdapter } from 'database/pool';
import { User } from 'domains/users/types';
import { onRequestHookHandler } from 'fastify';
import { query } from 'core/sql';

export const setupTenantStorage: onRequestHookHandler = async (req, reply) => {
  const user = req.session.get('user') as User;
  if (user?.activeTenant?.host) {
    try {
      //Connect to the active tenant of the user
      const { storage, connection } = await getTenantsQueryAdapter(
        user.activeTenant.host,
        parseInt(TENANTS_DATA_HOSTS_PORT as string, 10)
      );
      const { db } = storage;
      //Set the tenant context for row level security
      await db(
        query.setTenantContext({
          tenantId: user.activeTenant.id,
          secret: SAAS_DB_SECRET,
        })
      );
      req.tenantStorage = storage;
      req.tenantDataConnection = connection;
    } catch (e) {
      return req.error({
        message: 'Error connecting to tenant storage',
        err: e,
      });
    }
  }
};

export const releaseTenantDataConnection: onRequestHookHandler = async (
  req
) => {
  //Execute after response has been sent to client. Release client to pool if one was picked up
  await req.tenantDataConnection?.release();
};
