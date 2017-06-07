import { fake } from 'faker';
import { pickBy, mapValues, isString } from 'lodash';

const hasFake = (p: Object): boolean => isString(p.fake);
const fakeData = (p: Object): string => fake(`{{${p.fake}}}`);

function build(model: Function): Object {
  const { schema: { properties } } = model;
  return mapValues(pickBy(properties, hasFake), fakeData);
}

export { build }; // eslint-disable-line
