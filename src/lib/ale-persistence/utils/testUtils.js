// @flow
import { isString, mapValues, pickBy } from 'lodash';
import { fake } from 'faker';
import { models } from 'ale-persistence';
import { trace, log } from 'logger';

log(`testUtils.js`);

const hasFake = (p: { fake: ?string }): boolean => isString(p.fake);
const fakeData = (p: { fake: string }): string => fake(`{{${p.fake}}}`);

function build(model: string): any {
  const Model: () => any = models[model];
  trace(`Building for model ${model}`);
  const { schema: { properties } } = Model;
  return mapValues(pickBy(properties, hasFake), fakeData);
}

function create(modelName: string): Promise<any> {
  const Model: () => any = models[modelName];
  trace(`Creating for model ${modelName}`);
  return Model.query().insert(build('User'));
}

export { build, create };
