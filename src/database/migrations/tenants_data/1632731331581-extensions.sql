-- migrate:up

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- migrate:down

DROP EXTENSION IF EXISTS "pgcrypto"; 
DROP EXTENSION IF EXISTS "uuid-ossp"; 