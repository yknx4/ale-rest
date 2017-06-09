// @flow
import { memoize } from 'lodash';
import { info } from 'logger';
import { libState } from 'ale-persistence/store';
import ajv from '../config/ajv';
import {
  validateWithSchema,
  validateSaveSchema,
  fromDbResult,
  toNode,
} from './modelExtensions';
import getLoader from '../db/getLoader';

const { bookshelf } = libState;
const { Model: ModelBase } = bookshelf;

const generateModel = memoize((schema: Object): Function => {
  const { tableName, title: displayName } = schema;

  info(`Creating model ${displayName} with table ${tableName}`);

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
    toNode,
    type: displayName,
  });

  Object.defineProperty(Model, 'name', { value: displayName });
  Object.defineProperty(Model, 'schema', { value: schema });
  Object.defineProperty(Model, 'loader', {
    value: getLoader.bind(null, displayName),
  });
  Object.defineProperty(Model, 'rawQuery', {
    value: () => bookshelf.knex(tableName),
  });
  Object.defineProperty(Model, 'fromDbResult', { value: fromDbResult });

  info(`Model ${displayName} created.`);

  return bookshelf.model(displayName, Model);
}, s => s.title);

export default generateModel;
