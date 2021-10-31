INSERT INTO
  comments (tenant_id, user_id, comment)
VALUES
  (get_tenant()::UUID, :userId, :comment) RETURNING id, comment