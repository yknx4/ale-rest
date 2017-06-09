import { isString, mapValues, pickBy } from 'lodash';

import { fake } from 'faker';

const hasFake = (p: Object): boolean => isString(p.fake);
const fakeData = (p: Object): string => fake(`{{${p.fake}}}`);

function build(model: Function): Object {
  const { schema: { properties } } = model;
  return mapValues(pickBy(properties, hasFake), fakeData);
}

function create(model: Function): Promise<any> {
  return model.create(build(model));
}

export { build, create };
