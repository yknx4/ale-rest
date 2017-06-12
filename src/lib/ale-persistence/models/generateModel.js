// @flow
import { memoize, isString, mapKeys } from "lodash";
import { info, log } from "logger";
import { libModels } from "ale-persistence/store";
import { Model } from "objection";
import invariant from "invariant";
import { camel, snake } from "case";
import type { JSON$Schema } from "../types";
import getLoader from "../db/getLoader";
import { toNode } from "./modelExtensions";

log(`generateModel.js`);

const snakeCase = memoize(snake);
const camelCase = memoize(camel);

type isSchema = JSON$Schema | string;

const getSchema = (input: isSchema): JSON$Schema =>
  Object.freeze(isString(input) ? JSON.parse(input) : input);

function generateModelFromSchema(schemaInput: isSchema): () => Model {
  invariant(schemaInput, "You should include a schema");
  const schema: JSON$Schema = getSchema(schemaInput);
  const { title, tableName }: JSON$Schema = schema;
  info(`Creating Model ${title}`);
  const klass = class extends Model {
    static get tableName() {
      return tableName;
    }
    static get jsonSchema() {
      return schema;
    }
    //  eslint-disable-next-line class-methods-use-this
    get type() {
      return title;
    }
    toNode(cursorData, index, total) {
      return toNode.call(this, cursorData, index, total);
    }
    $formatDatabaseJson(json) {
      json = super.$formatDatabaseJson(json); // eslint-disable-line no-param-reassign
      return mapKeys(json, (value, key) => snakeCase(key));
    }

    // This is called when an object is read from database.
    $parseDatabaseJson(json) {
      json = mapKeys(json, (value, key) => camelCase(key)); // eslint-disable-line no-param-reassign

      return super.$parseDatabaseJson(json);
    }
  };

  Object.defineProperty(klass, "name", { value: title });
  Object.defineProperty(klass, "loader", {
    value: getLoader.bind(null, "User")
  });
  libModels[title] = klass;
  info(`Model ${title} created`);
  return klass;
}

export default memoize(generateModelFromSchema);
