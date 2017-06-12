// @flow
import { info, log } from "logger";
import { models } from "../index";

log(`batchGet.js`);

function batchGet(modelName: string): any {
  info(`Batch get from ${modelName}`);
  return (keys: Array<string>) => {
    info(`Getting ${keys.join(",")}`);
    const Model = models[modelName];
    return Model.query().where(Model.jsonSchema.primaryKey, "IN", keys);
  };
}

export default batchGet;
