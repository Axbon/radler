-- migrate:up

/* Make sure the saas_user can use sequences  */
GRANT USAGE ON SCHEMA public TO saas_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO saas_user;


-- migrate:down

REVOKE USAGE ON SCHEMA public FROM saas_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE USAGE, SELECT ON SEQUENCES FROM saas_user;
