export type Tenant = {
  id: string;
  name: string;
  website: string;
  streetAddress: string;
  city: string;
  zipcode: string;
  host: string;
};

export type CreateTenantPayload = {
  name: string;
  city: string;
  website: string;
  streetAddress: string;
};

export type AddUserRightPayload = {
  tenantId: string;
  userId: string;
  rightName: string;
};
