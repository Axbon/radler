
-- migrate:up

/* Make sure the user connecting to postgres have no access to this table */
CREATE TABLE secrets(
    sign_key TEXT NOT NULL
);

INSERT INTO secrets (sign_key) VALUES ('change this!!!');

/* The saas_user must exist, and be used by the backend */
REVOKE ALL PRIVILEGES on secrets FROM saas_user;

-- migrate:down

DROP TABLE IF EXISTS secrets;