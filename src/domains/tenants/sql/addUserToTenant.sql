INSERT INTO
  tenants_users (user_id, tenant_id)
VALUES
  (:userId, :tenantId) RETURNING user_id AS userId