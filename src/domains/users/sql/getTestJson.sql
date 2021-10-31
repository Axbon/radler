SELECT
  u.id,
  jsonb_agg(users_rights) AS rights
FROM
  users u
  LEFT JOIN users_rights ON u.id = users_rights.user_id
GROUP BY
  u.id