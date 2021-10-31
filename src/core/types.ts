import { Session } from '@mgcrea/fastify-session';
import { DBContext } from 'database/types';
import { User } from 'domains/users/types';
import { FastifyLoggerInstance } from 'fastify';

export type Service<T> = {
  storage: DBContext;
} & T;

export type AuthedApi<T = any> = {
  user: User;
  payload: T;
  tenantStorage: DBContext;
  tenantRegistry: DBContext;
  logger: FastifyLoggerInstance;
  error: ErrorParser;
  session: Session;
};

export type ProtectedApi = ({
  user,
  payload,
  tenantStorage,
  tenantRegistry,
  logger,
  error,
  session,
}: AuthedApi) => Promise<Response | void>;

export type MessageSeverity = 'SUCCESS' | 'INFO' | 'ERROR';

export type ClientMessage = {
  message: string;
  severity: MessageSeverity;
};

export type Response = {
  result: AllowedResponseData;
  messages: ClientMessage[];
};

/* Ideally we would want to exclude things that are not good for json serialization
   such as functions, but due to: https://github.com/microsoft/TypeScript/issues/1897
   we'll just leave it like so. */
export type AllowedResponseData = null | Record<string, any> | Array<any>;

export type Body<T> = {
  Body: T;
};

export type ErrorParser = ({
  message,
  err,
}: {
  message: string;
  err?: GenericError | unknown;
}) => void;

export type GenericError = Error & { code?: string };
