import { GraphQLObjectType, GraphQLInterfaceType } from 'graphql';

import { mapValues, mapKeys } from 'lodash';

import { camelKey, asFn } from '../selectors';
import { generateField } from './index';
import logger from '~/logger'; // eslint-disable-line
const { info } = logger;

function createObjectType(
  model: Function,
  graphqlInterface: GraphQLInterfaceType
): GraphQLObjectType {
  const { schema } = model;
  const { title: name, description, properties } = schema;
  info(`Creating GraphQLObjectType for ${name}`);
  // debug(properties);
  let fieldsData = mapValues(properties, generateField);
  fieldsData = mapKeys(fieldsData, camelKey);
  // debug(fieldsData);
  const fields = asFn(fieldsData);
  return new GraphQLObjectType({
    name: `${name}ObjectType`,
    description,
    fields,
    interfaces: [graphqlInterface],
  });
}

export default createObjectType;
