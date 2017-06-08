import { memoize } from 'lodash';
import ajv from '../config/ajv';
import initBookshelf from '../config/bookshelf';
import { validateWithSchema, validateSaveSchema } from './modelExtensions';
import logger from '~/logger'; // eslint-disable-line

const { debug } = logger;

const GenerateDefaultModel = knex => {
  const { Model: ModelBase, bookshelf } = initBookshelf(knex);
  const generatorFn = memoize((schema: Object): Function => {
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
      validateWithSchema,
      validateSaveSchema,
    });

    Object.defineProperty(Model, 'name', { value: displayName });
    Object.defineProperty(Model, 'displayName', { value: displayName });
    Object.defineProperty(Model, 'schema', { value: schema });

    debug(`Model ${displayName} created.`);

    return bookshelf.model(displayName, Model);
  }, s => s.title);

  generatorFn.bookshelf = bookshelf;
  return generatorFn;
};

export default GenerateDefaultModel;
