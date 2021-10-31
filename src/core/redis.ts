import { REDIS_HOST } from 'core/env';
import Redis from 'ioredis';
export const redis = new Redis(6379, REDIS_HOST);
