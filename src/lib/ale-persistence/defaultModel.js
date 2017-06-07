import stringify from 'json-stringify-safe';
import ajv from './config/ajv';
import initBookshelf from './config/bookshelf';
import logger from '~/logger'; // eslint-disable-line

const { debug, info } = logger();

const GenerateDefaultModel = knex => {
  const { Model: ModelBase } = initBookshelf(knex);
  return function defaultModel(schema: Object): Function {
    const { tableName, title: displayName } = schema;

    debug(`Creating model ${displayName} with table ${tableName}`);

    const Model = ModelBase.extend({
      constructor: function constructor() {
        ModelBase.apply(this, arguments); // eslint-disable-line prefer-rest-params
        this.on('saving', this.validateSaveSchema);
      },
      tableName,
      schemaValidator: ajv.compile(schema),
      schema,
      validateWithSchema: function validateWithSchema() {
        info(
          `Validating ${stringify(this.attributes)} against ${this.schema
            .title} schema.`
        );
        const validSchema = this.schemaValidator(this.attributes);
        info(`Result: ${validSchema}`);
        this.schemaErrors = this.schemaValidator.errors;
        return Promise.resolve(validSchema);
      },
      validateSaveSchema: function validateSaveSchema() {
        return this.validateWithSchema().then(valid => {
          if (!valid) {
            return Promise.reject(new Error('Invalid Object'));
          }
          return Promise.resolve();
        });
      },
    });

    Object.defineProperty(Model, 'name', { value: displayName });
    Object.defineProperty(Model, 'displayName', { value: displayName });
    Object.defineProperty(Model, 'schema', { value: schema });

    return Model;
  };
};

export default GenerateDefaultModel;
