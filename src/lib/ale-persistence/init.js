import Bookshelf from "bookshelf";
import { info } from "logger";
import { libState } from "./store";

function init(knex: Function): void {
  info("Initializing AlePersistence Framework");
  libState.knex = knex;
  const bookshelf = Bookshelf(knex, { debug: true });
  bookshelf.plugin("registry");
  libState.bookshelf = bookshelf;
}

export default init;
