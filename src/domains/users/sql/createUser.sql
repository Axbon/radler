INSERT INTO
  users(email, password, firstname, lastname)
VALUES
  (
    :email,
    :password,
    :firstname,
    :lastname
  ) RETURNING id, email, firstname, lastname