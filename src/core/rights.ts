import { ProtectedApi } from 'core/types';
import { User } from 'domains/users/types';
import { RouteHandlerMethod } from 'fastify';

/* Abstraction that separates the notion of a web context from internal apis
   Enables the use of a guard function that gets the user as arg. This lets
   us create other useful functions such as withRights().
  */
export const provider = (
  fn: ProtectedApi,
  guard: (u: User) => boolean | string = () => true
): RouteHandlerMethod => {
  return async ({
    session,
    tenantRegistry,
    tenantStorage,
    log,
    body,
    error,
  }) => {
    const user = session.get('user') as User;
    const patrol = guard(user);

    if (patrol === true) {
      return await fn({
        payload: body,
        user,
        tenantRegistry,
        tenantStorage,
        logger: log,
        error,
        session,
      });
    }
    return error({
      message:
        typeof patrol === 'string'
          ? patrol
          : 'Your right of passage was denied',
    });
  };
};

export const withRights = (rights: string[], fn: ProtectedApi) =>
  provider(fn, (u) => {
    const tenantId = u.activeTenant.id;
    const tenantRights = u.tenants.find((t) => t.tenantId === tenantId);
    //If tenant is not in user list of tenants or access rights are not correct, error
    const hasRights =
      tenantRights && tenantRights.rights.every((r) => rights.includes(r));
    if (!hasRights) {
      return 'Insufficient access rights, or no active tenant';
    }
    return true;
  });
