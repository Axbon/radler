import RedisStore from '@mgcrea/fastify-session-redis-store';
import { SESSION_TTL } from 'core/env';
import { redis } from 'core/redis';

const redisSessStore = new RedisStore({
  client: redis,
  ttl: SESSION_TTL,
});

export const sessionConfig = {
  secret: 'so secret',
  cookie: { maxAge: SESSION_TTL },
  store: redisSessStore,
};
