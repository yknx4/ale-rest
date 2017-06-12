// @flow
import { models } from "ale-persistence";
import { idType } from "ale-persistence/types";
import { info } from "logger";

function batchGet(modelName: string): any {
  info(`Batch get from ${modelName}`);
  return (keys: Array<idType>) => {
    info(`Getting ${keys.join(",")}`);
    const Model = models[modelName];
    return Model.query().where(Model.jsonSchema.primaryKey, "IN", keys);
  };
}

export default batchGet;
