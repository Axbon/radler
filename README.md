### Experiment in multi-tenancy-land

Experimental project to explore row level security
in postgres, and how to use this in a multitenant setup.

For added security I decided to implement signed session variables as recommended by
2ndquadrant.com for the RLS setup. There is a "secrets" table which the user connecting to the database have no access to, and thus can't query it.

This table contains the secret to sign the context session variable,
in this case the "tenant id" of the active connection. Each policy on each table uses this tenant id to separate data. This works for all types of queries.

The backend application can access this secret via .env file configuration. For added
security here you should implement something like a vault, see:
https://www.hashicorp.com/products/vault

### Tenant registry

The tenant registry contains a register of all the tenants, the users and the rights for each tenant. This database has the necessary information to connect to tenant specific databases.

### Tenants data

Tenant databases contain tenant-specific data. Each db can house multiple tenants. This is where row level security comes into play. Because of tenant isolation using rls, there is no need to add a `where tenant_id = x` to each query. Rls handles this.

### Database connection pooling

Using the standard node `pg` package which comes with built in pooling functionality.
If you're running a bigger operation of some sort, you're most likely using pgbouncer
or similar.

### The request lifecycle

- Setup

  - Establish a connection to the tenant registry
  - User has an active session with a selected tenant? Establish a second connection to that tenant specific database.
  - Use the function set_tenant() to setup a tenant id/context for this session. See the \*-security migration in `database/migrations/tenants_data`

- Teardown
  - Release all db connections back to the pool(s) once we send a response to the client. Queries that can span beyond the lifetime of a request poses a problem for this approach. The upside is, less responsibility for the developer. You could use pgbouncer as an alternative.

### Docker

For convenience when developing you can use docker to spawn three instances, the two postgres servers and another redis server. Cd into the `config` directory and run:

`docker-compose up` 

Obviously you need docker installed :)



### Server

For the server I decided to try fastify. I dislike their approach with "hooks" rather than traditional middlewares. I realise there is support for middlewares via some plugin. But, the entire thing just feels sort of clunky. It works for this experiment though.


### Routes

Route handlers are context aware, they know about fastify and the request object.
There are some unauthenticated routes and some that needs an active user session.

### Service APIs

Internal APIs (Services) doesn't know anything about the
context they run within, unlike route handlers. In this case "the web". They don't know about fastify or anything web related. They receive the "storage" argument containing database utilities, plus any other custom args. This let us test these APIs without much effort by mocking the database adapter. Besides this, it is easy to run services based on events or cron jobs, in different contexts.

Compare this to mocking an entire `"request" object`, it is not funny ;-)

### Environment

I intentionally left some values in the `.env.example` file within the `./config`
folder. You need to copy this file to `config/.env`, since it is not versioned.

It is important that the `SAAS_DB_SECRET` value in the env is the same as the
one used in the secrets table, see `database/migrations/tenants_data/*-secrets.sql`

Never leave `.env` files or sensitive values in version control.


### Postgres setup

There are a couple of things we need todo with the database(s) before we can
start using them.

- Create the tenants database(s)
- Create a less privileged user (Which doesn't have access to the secrets table)

Login to your docker terminal, the tenants-data running postgres.
`su` to become the postgres user.

`su postgres`

Now you can access the `createuser` and `createdb` binary. Let's use that:

```
  #create the db
  createdb tenants 

  #ansewer no to all promps asking for privileges after the next command
  createuser saas_user --interactive 

  #start psql so that we can run a query (see below)
  psql
```

Now, using psql it's time to create a password for the `saas_user`.

```
alter user saas_user with encrypted password 'changethis';
```

You need to do the same for the tenants registry container.

- Create the database called: tenants
- Create the less privileged saas_user

### Database migrations

Using a tiny tool I created called `ts-rove` to run migrations on these two databases.
This tool exposes an api, it also works as a simple cli. In this case I used the api. This let us connect to multiple tenant databases to run migrations.

You can run migration(s) by using the following commands

**Note: You must run the migrations for the tenantsregistry first, since
the tenantsdata migration uses hosts table from this db**

```
// Run all missing migrations
# yarn tenantsregistry migrate

// Revert the last migration
# yarn tenantsregistry revert

// Revert all migrations including "to"
# yarn tenantsregistry revert to <migration-name.sql>

// Create a new migration in database/migrations/tenants_data
# yarn tenantsregistry create <name-of-migration>
```



Switch `tenantsregistry` to `tenantsdata` depending on which database you are
creating or running migrations for. Migrations are always running as superuser.

Each migration is a pure .sql file, containing `--up`and `--down` blocks.
See `database/migrations/**` for examples.


### Yarn/Npm install

Do this before the running the server

### Run the migrations

By using the following commands:

```
# registry first
yarn tenantsregistry migrate

# then the tenant dbs
yarn tenantsdata migrate
```

### Start the server

You should now be able to start the fastify server using:

```
yarn dev
```

### APIs

I added some basic apis that lets us play around with the entire flow.
This let us:

- Register new users.
- Users can login.
- Users can create tenants.
- Users can set/select their active tenant.
- Users can create comments in specific tenants.

The user rights implementation is very simple and naive. But it is enough for testing the flow.

Some examples talking to this api using curl.

```
//Register a new user
curl --header Content-Type:application/json --data '{"email":"randomtest@changeit.com", "password":"supahsecret", "firstname":"John", "lastname":"Doe"}' "http://localhost:3000/register"

//Login with the user
curl --header Content-Type:application/json --data '{"email":"randomtest@changeit.com", "password":"supahsecret"}' --cookie curl_cookie.txt --cookie-jar curl_cookie.txt "http://localhost:3000/login"

//Create tenant (must be logged in user)
curl --header Content-Type:application/json --data '{"name":"The Company", "website":"https://theurl", "streetAddress":"The Street 22", "city":"Dreamland"}' --cookie curl_cookie.txt --cookie-jar curl_cookie.txt "http://localhost:3000/tenant"

//Select a tenant (Since one user can belong to multiple tenants) use the tenant id from previous response
curl --header Content-Type:application/json --data '{"tenantId":"theTenantId"}' --cookie curl_cookie.txt --cookie-jar curl_cookie.txt "http://localhost:3000/user/select-tenant"

//Add a comment in the active tenant
curl --header Content-Type:application/json --data '{"text":"Hello world"}' --cookie curl_cookie.txt --cookie-jar curl_cookie.txt "http://localhost:3000/comments"
```

### Notes...

- Not ready for production, this is just an experiment
- Only tested on mac osx
