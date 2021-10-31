import { Service } from 'core/types';
import { query } from 'domains/tenants/sql';
import {
  AddUserRightPayload,
  CreateTenantPayload,
  Tenant,
} from 'domains/tenants/types';
import { User } from 'domains/users/types';

/* These APIs speak to the registry */

export const createTenant = async ({
  storage: { db },
  ...rest
}: Service<CreateTenantPayload>) => {
  const [{ host }] = await db<{ host: string }>(query.getRandomTenantHost());
  const [tenant] = await db<Tenant>(query.createTenant({ ...rest, host }));
  return tenant;
};

export const addUserToTenant = async ({
  storage: { db },
  tenantId,
  userId,
}: Service<{ tenantId: string; userId: string }>) => {
  return await db(query.addUserToTenant({ tenantId, userId }));
};

export const addUserRight = async ({
  storage: { db },
  ...rest
}: Service<AddUserRightPayload>) => {
  const { tenantId, userId, rightName } = rest;
  const [right] = await db<{ id: number }>(query.getRightId({ rightName }));
  await db(query.addUserRight({ rightId: right.id, tenantId, userId }));
};

export const createTenantWithAdmin = async ({
  storage,
  user,
  tenantInfo,
}: Service<{ user: User; tenantInfo: CreateTenantPayload }>) => {
  const tenant = await createTenant({ storage, ...tenantInfo });
  const input = { storage, tenantId: tenant.id, userId: user.id };
  await addUserToTenant(input);
  await addUserRight({
    ...input,
    rightName: 'admin',
  });
  return tenant;
};

export const getTenantHost = async ({
  storage,
  tenantId,
}: Service<{ tenantId: string }>) => {
  const { db } = storage;
  const [{ host }] = await db<{ host: string }>(
    query.getTenantHost({ tenantId })
  );
  return host;
};
