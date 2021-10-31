
-- migrate:up
   
   CREATE TABLE users_rights (
      id BIGSERIAL,
      user_id UUID NOT NULL,
      tenant_id UUID NOT NULL,
      right_id integer NOT NULL,
      CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users (id),
      CONSTRAINT tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenants (id),
      CONSTRAINT right_fk FOREIGN KEY (right_id) REFERENCES rights (id),
      CONSTRAINT pkey_users_rights PRIMARY KEY (id),
      UNIQUE (user_id, tenant_id, right_id)
   );

   GRANT SELECT, UPDATE, INSERT, DELETE ON users_rights TO saas_user;

-- migrate:down

   DROP TABLE IF EXISTS users_rights;
