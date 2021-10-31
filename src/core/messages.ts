import { ClientMessage, MessageSeverity } from './types';

export const message = (
  message: string,
  severity: MessageSeverity = 'SUCCESS'
) => ({
  severity,
  message,
});

export const messages = (...msgs: ClientMessage[]) => msgs;
