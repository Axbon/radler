-- migrate:up

CREATE TABLE tenants_hosts (
   id SERIAL,
   host INET NOT NULL,
   CONSTRAINT pkey_tenants_hosts_id PRIMARY KEY (id)
);

/* Insert some hosts for testing, localhost for dev */
INSERT INTO tenants_hosts (host) values('127.0.0.1'), ('127.0.0.1'), ('127.0.0.1');

GRANT SELECT, UPDATE, INSERT, DELETE ON tenants_hosts TO saas_user;

-- migrate:down

DROP TABLE IF EXISTS tenants_hosts;