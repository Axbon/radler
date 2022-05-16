
-- migrate:up
   
CREATE TABLE testdata (
   tenant_id UUID NOT NULL,
   id SERIAL,
   test VARCHAR(255) NOT NULL,
   CONSTRAINT pkey_test_id PRIMARY KEY (tenant_id, id)
);

GRANT ALL ON testdata TO saas_user;

ALTER TABLE testdata ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON testdata USING (
   tenant_id::text = get_tenant()
);

-- migrate:down

DROP TABLE IF EXISTS testdata;
