import path from 'path';
import {
  DB_NAME,
  DB_PASS,
  DB_USER,
  TENANTS_DATA_HOSTS_PORT,
  TENANTS_REGISTRY_HOST,
  TENANTS_REGISTRY_PORT,
} from 'core/env';
import { run } from 'database/cli/migrationUtil';
import { Client } from 'pg';

import { query } from 'core/sql';

const MIGRATION_DIR = path.join(
  process.cwd(),
  'src/database/migrations/tenants_data'
);

const init = async () => {
  const tenantsRegistry = new Client({
    //Use env vars for this, this is just as an example
    user: DB_USER,
    host: TENANTS_REGISTRY_HOST,
    database: DB_NAME,
    password: DB_PASS,
    port: parseInt(TENANTS_REGISTRY_PORT, 10),
  });
  await tenantsRegistry.connect();
  const { sql } = query.getTenantHosts();
  const { rows } = await tenantsRegistry.query<{ host: string }>(sql);
  for (const server of rows) {
    const dbClient = new Client({
      user: DB_USER,
      database: DB_NAME,
      password: DB_PASS,
      host: server.host,
      port: parseInt(TENANTS_DATA_HOSTS_PORT as string, 10),
    });

    //Run migration command on all hosts
    await run(process.argv.slice(2), dbClient, MIGRATION_DIR);
  }
  await tenantsRegistry.end();
};

init();
