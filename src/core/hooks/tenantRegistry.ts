import { TENANTS_REGISTRY_HOST, TENANTS_REGISTRY_PORT } from 'core/env';
import { getTenantsQueryAdapter } from 'database/pool';
import { onRequestHookHandler } from 'fastify';

export const setupTenantRegistry: onRequestHookHandler = async (req) => {
  try {
    const { storage, connection } = await getTenantsQueryAdapter(
      TENANTS_REGISTRY_HOST as string,
      parseInt(TENANTS_REGISTRY_PORT as string, 10)
    );
    req.tenantRegistry = storage;
    req.tenantRegistryConnection = connection;
  } catch (e) {
    return req.error({
      message: 'Error connecting to tenant registry',
      err: e,
    });
  }
};

export const releaseTenantRegistryConnection: onRequestHookHandler = async (
  req
) => {
  //Execute after response has been sent to client. Release client to pool if one was picked up
  await req.tenantRegistryConnection?.release();
};
