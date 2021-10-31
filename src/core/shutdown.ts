import { shutdownPools } from 'database/pool';
import { FastifyInstance } from 'fastify';
import { redis } from './redis';

export const shutdown = async (signal: string, app: FastifyInstance) => {
  //Exit gracefully once the eventloop queue is clear
  app.log.info(`${signal} received. Trying to shutdown`);
  try {
    redis.disconnect();
    await app.close();
    await shutdownPools();
    app.log.info('Server, db pools and redis exited successfully');
  } catch (e) {
    const err = e as Error;
    app.log.error(`Error during graceful shutdown: ${err?.message}`);
  }
};
