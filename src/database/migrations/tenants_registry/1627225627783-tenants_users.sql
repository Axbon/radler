-- migrate:up

CREATE TABLE tenants_users (
   id BIGSERIAL,
   user_id UUID NOT NULL,
   tenant_id UUID NOT NULL,
   CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users (id),
   CONSTRAINT tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenants (id),
   CONSTRAINT pkey_tenants_users_id PRIMARY KEY (id),
   UNIQUE (user_id, tenant_id)
);

GRANT SELECT, UPDATE, INSERT, DELETE ON tenants_users TO saas_user;

-- migrate:down

DROP TABLE IF EXISTS tenants_users;