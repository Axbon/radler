import { message } from 'core/messages';
import { response } from 'core/response';
import { AuthedApi } from 'core/types';
import { createTenantWithAdmin } from 'domains/tenants/registry';
import { CreateTenantPayload } from 'domains/tenants/types';
import { getUserByEmail } from 'domains/users/services';

export const tenantRoutes = {
  async createTenant({
    payload: tenantInfo,
    user,
    tenantRegistry: storage,
    session,
    error,
  }: AuthedApi<CreateTenantPayload>) {
    const { begin, commit, rollback } = storage;
    try {
      await begin();
      //The first user of a tenant is always an admin
      const tenant = await createTenantWithAdmin({
        storage,
        tenantInfo,
        user,
      });
      await commit();
      const refreshedUser = await getUserByEmail({
        storage,
        email: user.email,
      });
      session.set('user', refreshedUser);
      return response(tenant, [message('Tenant created successfully')]);
    } catch (e) {
      await rollback();
      return error({ message: 'Tenant could not be created', err: e });
    }
  },
};
