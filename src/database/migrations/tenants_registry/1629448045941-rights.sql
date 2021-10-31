
-- migrate:up
   
   CREATE TABLE rights ( 
      id SERIAL,
      name VARCHAR(255) NOT NULL UNIQUE,
      CONSTRAINT pkey_rights_id PRIMARY KEY (id)
   );

   INSERT INTO rights (name) values('admin');

   GRANT SELECT, UPDATE, INSERT, DELETE ON rights TO saas_user;

-- migrate:down

   DROP TABLE IF EXISTS rights;
