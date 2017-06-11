// @flow
import { isString, mapValues, pickBy } from "lodash";
import { fake } from "faker";
import { modelsProxy } from "ale-persistence/models";
import { trace } from "logger";

const hasFake = (p: { fake: ?string }): boolean => isString(p.fake);
const fakeData = (p: { fake: string }): string => fake(`{{${p.fake}}}`);

function build(model: string): any {
  const Model = modelsProxy[model];
  trace(`Building for model ${model}`);
  const { schema: { properties } } = Model;
  return mapValues(pickBy(properties, hasFake), fakeData);
}

async function create(modelName: string) {
  const Model = modelsProxy[modelName];
  trace(`Creating for model ${modelName}`);
  const instance = new Model(build(modelName));
  const savePromise = instance.save();
  trace(savePromise);
  savePromise.then(console.log);
  return savePromise;
}

export { build, create };
