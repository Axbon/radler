export type User = Readonly<{
  id: string;
  name: string;
  email: string;
  password: string;
  activeTenant: {
    host: string | null;
    id: string | null;
  };
  tenants: UserTenant[];
}>;

export type UserTenant = {
  tenantId: string;
  tenantName: string;
  rights: string[];
};

export type LoginUserPayload = {
  email: string;
  password: string;
};

export type CreateUserPayload = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};
