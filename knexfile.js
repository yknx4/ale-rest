// Update with your config settings.
module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "ale-rest-development",
      user: "postgres",
      password: "postgres"
    },
    pool: {
      min: 1,
      max: 100
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  test: {
    client: "postgresql",
    connection: {
      database: "ale-rest-test",
      user: "postgres",
      password: "postgres"
    },
    pool: {
      min: 5,
      max: 100
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};
