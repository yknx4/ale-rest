import aKnexCleaner from "knex-cleaner";
import knex from "./src/config/knex";
import init from "ale-persistence/init";

init(knex);

beforeAll(async () => {
  await aKnexCleaner.clean(knex, {
    mode: "truncate",
    ignoreTables: ["knex_migrations", "knex_migrations_lock"]
  });
});

afterAll(() => {
  knex.destroy();
});
