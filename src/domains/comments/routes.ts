import { message } from 'core/messages';
import { response } from 'core/response';
import { AuthedApi } from 'core/types';
import { addComment } from './services';

export const commentsRoutes = {
  async addComment({
    payload,
    tenantStorage: storage,
    user,
  }: AuthedApi<{ text: string }>) {
    const { text } = payload;
    await addComment({ storage, text, userId: user.id });
    return response([], [message('Hola')]);
  },
};
