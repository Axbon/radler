import { Service } from 'core/types';
import { query } from 'domains/comments/sql';

export const addComment = async ({
  storage,
  text,
  userId,
}: Service<{ text: string; userId: string }>) => {
  const { db } = storage;
  const comment = await db(query.addComment({ comment: text, userId }));
  return comment;
};
