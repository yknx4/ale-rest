// @flow
import { find } from 'lodash';
import { info, log } from 'logger';
import { models } from '../index';

type idType = string | number;

log(`batchGet.js`);

function batchGet(modelName: string): any {
  info(`Batch get from ${modelName}`);
  return async (keys: Array<idType>) => {
    info(`Getting ${keys.join(',')}`);
    const Model = models[modelName];
    const result = await Model.query().where(
      Model.jsonSchema.primaryKey,
      'IN',
      keys
    );
    return keys.map(k => find(result, { id: parseInt(k, 10) }));
  };
}

export default batchGet;
