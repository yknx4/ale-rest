import { Model } from "objection";
import { info } from "logger";
import { libState } from "./store";

function init(knex: Function): void {
  info("Initializing AlePersistence Framework");
  libState.knex = knex;
  Model.knex(knex);
}

export default init;
