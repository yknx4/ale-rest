import "dotenv/config";
import init from "ale-persistence/init";
import hideStack from "hide-stack-frames-from";
import { info } from "logger";
import knex from "./config/knex";

info(`Initializing AleRest`);
// hideStack('lodash', 'babel-register', 'bluebird');
init(knex);
