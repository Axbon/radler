
-- migrate:up

/* Usage: SELECT set_tenant('tenantId', 'passphrase') */
CREATE FUNCTION set_tenant(tenantid TEXT, pwd TEXT) RETURNS text AS $$
DECLARE
    v_key   TEXT;
    v_value TEXT;
BEGIN
    SELECT sign_key INTO v_key FROM secrets;
    v_value := tenantid || ':' || extract(epoch from now())::int;
    v_value := v_value || ':' || crypt(v_value || ':' || v_key,
                                       gen_salt('bf'));
    PERFORM set_config('context.tenant', v_value, false);
    RETURN v_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


/* Usage: SELECT get_tenant() to get the active tenant */
CREATE FUNCTION get_tenant() RETURNS text AS $$
DECLARE
    v_key   TEXT;
    v_parts TEXT[];
    v_tenantid TEXT;
    v_value TEXT;
    v_timestamp INT;
    v_signature TEXT;

BEGIN
    -- no password verification this time
    SELECT sign_key INTO v_key FROM secrets;

    v_parts := regexp_split_to_array(current_setting('context.tenant', true), ':');
    v_tenantid := v_parts[1];
    v_timestamp := v_parts[2];
    v_signature := v_parts[3];

    v_value := v_tenantid || ':' || v_timestamp || ':' || v_key;
    IF v_signature = crypt(v_value, v_signature) THEN
        RETURN v_tenantid;
    END IF;

    RAISE EXCEPTION 'Insufficient tenant permissions';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- migrate:down

DROP FUNCTION IF EXISTS set_tenant(tenantid TEXT, pwd TEXT);
DROP FUNCTION IF EXISTS get_tenant();