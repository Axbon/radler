import { DB_NAME, SAAS_DB_PASS, SAAS_DB_USER, DB_USER } from 'core/env';
import { DBContext } from 'database/types';
import { Pool, PoolClient } from 'pg';

const tenantsPoolCache = new Map<string, Pool>();

export const getQueryAdapter = ({
  connection,
}: {
  connection: PoolClient;
}): {
  connection: PoolClient;
  storage: DBContext;
} => {
  return {
    connection,
    storage: {
      db: async ({ params, sql }) => {
        //TODO Should we log sql in console during development for fun & profit?
        const result = await connection.query(sql, params);
        const { rows } = result;
        return Object.freeze(rows);
      },
      begin: async () => await connection.query('BEGIN'),
      commit: async () => await connection.query('COMMIT'),
      rollback: async () => await connection.query('ROLLBACK'),
    },
  };
};

export const getTenantsQueryAdapter = async (
  host: string,
  port: number
): Promise<{
  connection: PoolClient;
  storage: DBContext;
}> => {
  //One pool per host
  const adapter =
    tenantsPoolCache.get(host) ??
    new Pool({
      user: SAAS_DB_USER,
      host: host,
      database: DB_NAME,
      password: SAAS_DB_PASS,
      port,
    });

  tenantsPoolCache.set(host, adapter);

  /* Acquires a client from the pool. 
     If the pool is 'full' and all clients are currently checked out, 
     this will wait in a FIFO queue until a client becomes available 
     by it being released back to the pool. */
  const connection = await adapter.connect();
  return getQueryAdapter({ connection });
};

export const shutdownPools = async () => {
  for (const pool of tenantsPoolCache.values()) {
    await pool.end();
  }
};
