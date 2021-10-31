-- migrate:up

CREATE TABLE comments (
   id BIGSERIAL NOT NULL,
   tenant_id UUID NOT NULL,
   user_id UUID NOT NULL,
   comment TEXT NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
   CHECK(
      EXTRACT(
         TIMEZONE
         FROM
            created_at
      ) = '0'
   ) ,
   CONSTRAINT pkey_comments PRIMARY KEY (id)
);


/* Explicitly give permissions to this table as part of saas app 
   However, oviously adhere to the policy */

GRANT ALL ON comments TO saas_user;

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON comments USING (
   tenant_id::text = get_tenant()
);


-- migrate:down
DROP TABLE IF EXISTS comments