// @flow
import { isString, mapValues, pickBy } from "lodash";
import { fake } from "faker";
import { models } from "ale-persistence";
import { trace } from "logger";

const hasFake = (p: { fake: ?string }): boolean => isString(p.fake);
const fakeData = (p: { fake: string }): string => fake(`{{${p.fake}}}`);

function build(model: string): any {
  const Model = models[model];
  trace(`Building for model ${model}`);
  const { schema: { properties } } = Model;
  return mapValues(pickBy(properties, hasFake), fakeData);
}

async function create(modelName: string) {
  const Model = models[modelName];
  trace(`Creating for model ${modelName}`);
  const instance = new Model(build(modelName));
  const savePromise = instance.save();
  trace(savePromise);
  return savePromise;
}

export { build, create };
