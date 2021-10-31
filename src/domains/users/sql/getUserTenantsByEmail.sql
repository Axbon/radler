/* The tenants that the user can access */
SELECT
  tu.user_id,
  tu.tenant_id,
  t.name
FROM
  tenants_users tu
  LEFT JOIN tenants t ON tu.tenant_id = t.id
  LEFT JOIN users u ON tu.user_id = u.id
WHERE
  u.email = :email