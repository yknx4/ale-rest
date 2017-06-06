import stringify from 'json-stringify-safe';
import ajv from './config/ajv';
import { ModelBase, bookshelfDb } from './config/knex';
import logger from '~/logger'; // eslint-disable-line

const { debug, info } = logger();

bookshelfDb.Model.prototype.validateWithSchema = function validateWithSchema() {
  info(
    `Validating ${stringify(this.attributes)} against ${this.schema
      .title} schema.`
  );
  const validSchema = this.schemaValidator(this.attributes);
  info(`Result: ${validSchema}`);
  this.schemaErrors = this.schemaValidator.errors;
  return Promise.resolve(validSchema);
};

function defaultModel(schema) {
  const { tableName, title: displayName } = schema;

  debug(`Creating model ${displayName} with table ${tableName}`);

  const Model = ModelBase.extend({
    tableName,
    schemaValidator: ajv.compile(schema),
    schema,
  });

  Object.defineProperty(Model, 'name', { value: displayName });
  Object.defineProperty(Model, 'displayName', { value: displayName });

  return Model;
}

export default defaultModel;
