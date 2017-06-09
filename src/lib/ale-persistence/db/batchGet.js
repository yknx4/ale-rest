// @flow
import { modelsProxy } from 'ale-persistence/models';
import { idType } from 'ale-persistence/types';

function batchGet(modelName: string) {
  return async (keys: Array<idType>) => {
    const Model = modelsProxy[modelName];
    const collection = await Model.fromDbResult(
      Model.rawQuery().where(Model.schema.primaryKey, 'IN', keys)
    );
    return collection.toArray();
  };
}

export default batchGet;
