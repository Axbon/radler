import { provider, withRights } from 'core/rights';
import { commentsRoutes } from 'domains/comments/routes';
import { tenantRoutes } from 'domains/tenants/routes';
import { userRoutes } from 'domains/users/routes';
import { FastifyInstance } from 'fastify';
import { withSchema } from 'core/preconditions';
import { publicUserRoutes } from 'domains/users/routes';
import loginSchema from 'domains/users/validation/loginPayload.json';
import registerSchema from 'domains/users/validation/registerPayload.json';
/*
 * Authenticated routes only, need a proper logged in
 * user and session for these protected routes.
 * */

export const authenticated = (app: FastifyInstance) => {
  app.post('/tenant', provider(tenantRoutes.createTenant));
  app.post('/user/select-tenant', provider(userRoutes.setMyActiveTenant));
  app.post('/comments', provider(commentsRoutes.addComment));
  //app.post('/some/example', withRights(['x', 'y', 'z'], authedApi));
};

/*
 * Note: Unauthenticated public routes. Callable without having
 * a proper session nor api auth.
 * */

export const unauthenticated = (app: FastifyInstance) => {
  app.post('/logout', publicUserRoutes.logoutUser);
  app.post('/login', withSchema(loginSchema), publicUserRoutes.login);
  app.post('/register', withSchema(registerSchema), publicUserRoutes.register);
};
