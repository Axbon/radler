SELECT
  u.id,
  u.firstname,
  u.lastname,
  u.email,
  u.password, 
  json_build_object(
    'host', null,
    'id', null
  ) activeTenant
FROM
  users u
WHERE
  u.email = :email
GROUP BY
  u.id


  /*
  SELECT *
FROM   photo p
CROSS  JOIN LATERAL (
   SELECT json_agg(c) AS comments
   FROM   comment c
   WHERE  photo_id = p.photo_id
   ) c1
CROSS  JOIN LATERAL (
   SELECT json_agg(t) AS tags
   FROM   photo_tag pt
   JOIN   tag       t USING (tag_id)
   WHERE  pt.photo_id = p.photo_id
   ) t
WHERE  p.photo_id = 2;  -- arbitrary selection

We can make above query into something like
 user
   tenants
      [x]: rights,
      [y]: rights

This returns whole rows from comment and tag, aggregated into JSON arrays separately. 
Rows are not multiplies like in your attempt, 
but they are only as "distinct" as they are in your base tables.

select row_to_json(row) from (
	select 
		tenant_id tenantId, 
		json_agg(r.name) rights
		from 
		users_rights ur
		inner join rights r on r.id = ur.right_id
		where user_id = '84dfa2f3-ba7e-4c07-8837-c6fbe9eed33e'
		group by tenant_id
) row
*/