import { fake } from 'faker';
import { pickBy, mapValues, isString } from 'lodash';

const hasFake = p => isString(p.fake);
const fakeData = p => fake(`{{${p.fake}}}`);

function build(model) {
  const { schema: { properties } } = model;
  return mapValues(pickBy(properties, hasFake), fakeData);
}

export { build }; // eslint-disable-line
