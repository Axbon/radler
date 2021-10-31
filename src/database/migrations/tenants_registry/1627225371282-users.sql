-- migrate:up

CREATE TABLE users (
   id UUID NOT NULL DEFAULT uuid_generate_v4(),
   email VARCHAR(255) NOT NULL UNIQUE,
   password VARCHAR(500) NOT NULL,
   firstname VARCHAR(255),
   lastname VARCHAR(255),
   CONSTRAINT pkey_tenants_users PRIMARY KEY (id)
);

GRANT SELECT, UPDATE, INSERT, DELETE ON users TO saas_user;

-- migrate:down

DROP TABLE IF EXISTS users;