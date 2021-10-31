#!/usr/bin/env node
import path from 'path';
import {
  DB_NAME,
  DB_PASS,
  DB_USER,
  TENANTS_REGISTRY_HOST,
  TENANTS_REGISTRY_PORT,
} from 'core/env';
import { run } from 'database/cli/migrationUtil';
import { Client } from 'pg';

const tenantsRegistry = new Client({
  //Use env vars for this, this is just as an example
  user: DB_USER,
  host: TENANTS_REGISTRY_HOST,
  database: DB_NAME,
  password: DB_PASS,
  port: parseInt(TENANTS_REGISTRY_PORT, 10),
});

const MIGRATION_DIR = path.join(
  process.cwd(),
  'src/database/migrations/tenants_registry'
);

run(process.argv.slice(2), tenantsRegistry, MIGRATION_DIR);
