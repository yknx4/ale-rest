// @flow
import { find } from 'lodash';
import { info, log } from 'logger';
import { Model as BaseModel } from 'objection';
import { models } from '../index';

type idType = string | number;
type idArray = Array<idType>;
type modelArray = Array<BaseModel>;
type modelArrayPromise = Promise<modelArray>;
type getterFn = (keys: idArray) => modelArrayPromise;

log(`batchGet.js`);

async function batchGetFromModel(
  Model: () => any,
  keys: idArray
): modelArrayPromise {
  info(`Getting ${keys.join(',')}`);
  const result = await Model.query().where(
    Model.jsonSchema.primaryKey,
    'IN',
    keys
  );
  return keys.map(k => find(result, { id: parseInt(k, 10) }));
}

function batchGet(modelName: string): getterFn {
  info(`Batch get from ${modelName}`);
  const Model = models[modelName];
  return (keys: idArray): modelArrayPromise => batchGetFromModel(Model, keys);
}

export default batchGet;
