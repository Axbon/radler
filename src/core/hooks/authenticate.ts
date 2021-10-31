import { onRequestHookHandler } from 'fastify';

export const authenticate: onRequestHookHandler = async (req, reply, done) => {
  const user = req.session.get('user');
  if (!user) {
    reply.status(401).send({ error: 'Unauthorized' });
    return reply;
  }
};
