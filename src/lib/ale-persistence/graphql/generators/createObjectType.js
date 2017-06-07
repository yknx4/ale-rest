import { GraphQLObjectType, GraphQLInterfaceType } from 'graphql';

import { mapValues, mapKeys } from 'lodash';

import { camelKey } from '../selectors';
import { generateField } from './index';
import logger from '~/logger'; // eslint-disable-line
const { info } = logger();

function createObjectType(
  model,
  graphqlInterface: GraphQLInterfaceType
): GraphQLObjectType {
  const { schema } = model;
  const { title: name, description, properties } = schema;
  info(`Creating GraphQLObjectType for ${name}`);
  // debug(properties);
  let fieldsData = mapValues(properties, generateField);
  fieldsData = mapKeys(fieldsData, camelKey);
  // debug(fieldsData);
  const fields = () => fieldsData;
  return new GraphQLObjectType({
    name,
    description,
    fields,
    interfaces: [graphqlInterface],
  });
}

export default createObjectType;
