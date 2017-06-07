import { GraphQLInputObjectType } from 'graphql';

import { mapValues, mapKeys } from 'lodash';

import { camelKey } from '../selectors';
import { generateInputField } from './index';
import logger from '~/logger'; // eslint-disable-line
const { info } = logger();

function createInputType(model): GraphQLInputObjectType {
  const { schema } = model;
  const { title: name, properties } = schema;
  info(`Creating GraphQLInputObjectType for ${name}`);
  // debug(properties);
  let fieldsData = mapValues(properties, generateInputField);
  fieldsData = mapKeys(fieldsData, camelKey);
  // debug(fieldsData);
  return new GraphQLInputObjectType({
    name: `${name}Input`,
    fields: fieldsData,
  });
}

export default createInputType;
