INSERT INTO
  tenants (host, name, website, street_address)
VALUES
  (:host, :name, :website, :streetAddress) 
  RETURNING id, host, name, website, street_address as streetAddress