import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../config/.env'),
});

const required = [
  'MASTER_NODE',
  'REDIS_HOST',
  'SESSION_TTL',
  'TENANTS_REGISTRY_HOST',
  'TENANTS_REGISTRY_PORT',
  'TENANTS_DATA_HOSTS_PORT',
  'DB_USER',
  'DB_PASS',
  'DB_NAME',
  'SAAS_DB_USER',
  'SAAS_DB_PASS',
  'SAAS_DB_SECRET',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing env variable ${key}`);
  }
}

export const IS_PROD = process.env.NODE_ENV === ('production' as string);
export const IS_DEV = process.env.NODE_ENV === ('development' as string);
export const IS_MASTER_NODE = process.env.MASTER_NODE === ('true' as string);

export const REDIS_HOST = process.env.REDIS_HOST as string;
export const SESSION_TTL = parseInt(
  (process.env.SESSION_TTL as string) ?? '86400',
  10
);

export const TENANTS_REGISTRY_HOST = process.env
  .TENANTS_REGISTRY_HOST as string;
export const TENANTS_REGISTRY_PORT = process.env
  .TENANTS_REGISTRY_PORT as string;

export const TENANTS_DATA_HOSTS_PORT = process.env
  .TENANTS_DATA_HOSTS_PORT as string;

export const DB_USER = process.env.DB_USER as string;
export const DB_PASS = process.env.DB_PASS as string;
export const DB_NAME = process.env.DB_NAME as string;

export const SAAS_DB_USER = process.env.SAAS_DB_USER as string;
export const SAAS_DB_PASS = process.env.SAAS_DB_PASS as string;

export const SAAS_DB_SECRET = process.env.SAAS_DB_SECRET as string;
