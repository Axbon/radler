import fastifySession from '@mgcrea/fastify-session';
import { handleExceptions } from 'core/hooks/errors';
import { authenticatedRoutes, unauthenticatedRoutes } from 'core/router';
import { sessionConfig } from 'core/session';
import { shutdown } from 'core/shutdown';
import fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';

const app = fastify({
  logger: {
    prettyPrint: true,
  },
});

app.register(fastifyCookie);
app.register(fastifySession, sessionConfig);
app.register(unauthenticatedRoutes);
app.register(authenticatedRoutes);
app.setErrorHandler(handleExceptions);

const start = async () => {
  try {
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

process.on('SIGTERM', () => shutdown('SIGTERM', app));
process.on('SIGINT', () => shutdown('SIGINT', app));
