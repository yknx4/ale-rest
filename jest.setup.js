import aKnexCleaner from "knex-cleaner";
import knex from "./src/config/knex";

beforeAll(async () => {
  await aKnexCleaner.clean(knex, { mode: "truncate" });
});
