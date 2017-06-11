// @flow
import { modelsProxy } from "ale-persistence/models";
import { idType } from "ale-persistence/types";
import { info } from "logger";

function batchGet(modelName: string) {
  info(`Batch get from ${modelName}`);
  return async (keys: Array<idType>) => {
    info(`Getting ${keys.join(",")}`);
    const Model = modelsProxy[modelName];
    const collection = await Model.fromDbResult(
      Model.rawQuery().where(Model.schema.primaryKey, "IN", keys)
    );
    return collection.toArray();
  };
}

export default batchGet;
