import { QueryResult } from 'pg';

export type QueryInput = {
  params?: Array<any>;
  sql: string;
};

export type QueryAdapter = <T = any>({
  params,
  sql,
}: QueryInput) => Promise<Readonly<T[]>>;

export type DBContext = {
  db: QueryAdapter;
  begin: () => Promise<QueryResult<any>>;
  commit: () => Promise<QueryResult<any>>;
  rollback: () => Promise<QueryResult<any>>;
};

export type DBContextGetter = () => DBContext;
