SELECT
  t.name "tenantName",
  tenant_id "tenantId",
  json_agg(r.name) rights
FROM
  users_rights ur
  INNER JOIN rights r ON r.id = ur.right_id
  INNER JOIN tenants t ON ur.tenant_id = t.id
WHERE
  ur.user_id = :userId
GROUP BY
  ur.tenant_id,
  t.name