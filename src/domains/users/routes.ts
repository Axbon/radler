import bcrypt from 'bcrypt';
import { message } from 'core/messages';
import { response } from 'core/response';
import { AuthedApi, Body, GenericError } from 'core/types';
import { PG_UNIQUE_VIOLATION } from 'database/pgErrors';
import { getTenantHost } from 'domains/tenants/registry';
import { createUser, getUserByEmail } from 'domains/users/services';
import { CreateUserPayload, LoginUserPayload } from 'domains/users/types';
import { FastifyRequest } from 'fastify';

export const userRoutes = {
  async setMyActiveTenant({
    user,
    session,
    payload,
    error,
    tenantRegistry: storage,
  }: AuthedApi<{ tenantId: string }>) {
    const { tenantId } = payload;
    const hasAccessToTenant = user.tenants.find((t) => t.tenantId === tenantId);
    if (!hasAccessToTenant) {
      return error({ message: 'No access to given tenant' });
    }
    const host = await getTenantHost({ storage, tenantId });
    const u = {
      ...user,
      activeTenant: {
        host,
        id: tenantId,
      },
    };
    session.set('user', u);
    return response({ tenantId: 1 }, [message('Switched to tenant X')]);
  },
};

export const publicUserRoutes = {
  async register({
    error,
    body,
    tenantRegistry: storage,
  }: FastifyRequest<Body<CreateUserPayload>>) {
    try {
      const user = await createUser({ storage, ...body });
      return response(user, [message('yes!')]);
    } catch (e) {
      const err = e as GenericError;
      return err?.code === PG_UNIQUE_VIOLATION
        ? error({ message: 'This email already exists' })
        : error({
            message: 'Something went wrong while registering the user',
            err,
          });
    }
  },

  async login({
    body,
    session,
    error,
    tenantRegistry,
  }: FastifyRequest<Body<LoginUserPayload>>) {
    const { email } = body;
    const user = await getUserByEmail({ storage: tenantRegistry, email });

    if (!user.id) {
      return error({ message: 'Incorrect mail' });
    }

    const { password, ...safeProps } = user;
    const isValidPassword = await bcrypt.compare(body.password, password);

    if (!isValidPassword) {
      return error({ message: 'Incorrect email or password' });
    }

    session.set('user', safeProps);
    return response(safeProps, [message('Logged in')]);
  },

  async logoutUser({ session }: FastifyRequest) {
    await session.destroy();
    return response(null, [message('Logged out!')]);
  },
};
