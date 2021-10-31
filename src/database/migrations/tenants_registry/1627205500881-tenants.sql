-- migrate:up

CREATE TABLE tenants (
   id UUID NOT NULL DEFAULT uuid_generate_v4(),
   host INET NOT NULL,
   name VARCHAR(255) NOT NULL,
   website VARCHAR(255) NOT NULL,
   street_address VARCHAR(255),
   zipcode VARCHAR(255),
   city VARCHAR(255),
   CONSTRAINT pkey_tenants PRIMARY KEY (id)
);

GRANT SELECT, UPDATE, INSERT, DELETE ON tenants TO saas_user;

-- migrate:down

DROP TABLE IF EXISTS tenants;