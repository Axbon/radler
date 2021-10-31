import { AllowedResponseData, ClientMessage } from 'core/types';

export const response = (
  result: AllowedResponseData,
  messages: ClientMessage[] = []
) => {
  return {
    result,
    messages,
    errors: null,
  };
};
