import { redis } from 'core/redis';
import { onRequestHookHandler } from 'fastify';

// Limit successive requests to specific routes, prevent hammering.
export const throttle: onRequestHookHandler = async (req, reply) => {
  const { ip } = req;
  const loginAttemptKey = `${ip}:login`;
  const previousTry = await redis.get(loginAttemptKey);
  if (previousTry) {
    reply.status(401).send({ error: 'Trying a little too much, too fast' });
    return reply;
  }
  await redis.set(loginAttemptKey, 1, 'px', 3000);
};
