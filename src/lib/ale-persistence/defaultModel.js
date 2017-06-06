import { ModelBase } from './config/knex';
import logger from '~/logger'; // eslint-disable-line

const { debug } = logger();

function defaultModel(schema) {
  const { tableName, title: displayName } = schema;

  debug(`Creating model ${displayName} with table ${tableName}`);

  const Model = ModelBase.extend({
    tableName,
  });

  Object.defineProperty(Model, 'name', { value: displayName });
  Object.defineProperty(Model, 'displayName', { value: displayName });

  return Model;
}

export default defaultModel;
