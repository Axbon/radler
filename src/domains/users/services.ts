import bcrypt from 'bcrypt';
import { Service } from 'core/types';
import { query } from 'domains/users/sql';
import { CreateUserPayload, User, UserTenant } from 'domains/users/types';

export const createUser = async ({
  storage,
  ...input
}: Service<CreateUserPayload>) => {
  const { db } = storage;
  //Note: bcrypt adds like 70ms latency to this call, don't be fooled by bad performance
  const password = await bcrypt.hash(input.password, 10);
  const [user] = await db<Omit<User, 'activeTenant' | 'password'>>(
    query.createUser({ ...input, password })
  );

  return {
    ...user,
    activeTenant: null,
    rights: [],
  };
};

export const getUserByEmail = async ({
  storage,
  email,
}: Service<{ email: string }>) => {
  const { db } = storage;
  const [user] = await db<Omit<User, 'tenants'>>(
    query.getUserByEmail({ email })
  );
  const tenants = user?.id
    ? await db<UserTenant>(query.getUserTenants({ userId: user.id }))
    : [];
  return {
    ...user,
    tenants,
  };
};
