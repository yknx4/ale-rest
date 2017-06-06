import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';

import { mapValues, mapKeys, isString, values } from 'lodash';
import { camel } from 'case';

import resolve from './getOutputFromInstance';
import logger from '~/logger'; // eslint-disable-line
// const { debug } = logger();

const getDescription = description =>
  isString(description) ? description : 'Missing Description';
const camelKey = (_, k) => camel(k);

const schemaGraphTypeMap = {
  [undefined]: GraphQLString,
  string: GraphQLString,
  integer: new GraphQLNonNull(GraphQLInt),
};

function generateField({ type, description }: Object): Object {
  return {
    type: schemaGraphTypeMap[type],
    description: getDescription(description),
    resolve,
  };
}

function createType(
  model,
  graphqlInterface: GraphQLInterfaceType
): GraphQLObjectType {
  const { schema } = model;
  const { title: name, description, properties } = schema;
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

function createGraphQlRootQuery(models): GraphQLSchema {
  const typesMap = {};

  const modelInterface = new GraphQLInterfaceType({
    name: 'Model',
    description: 'A valid ale-rest Model',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        description: 'The id of the model.',
      },
      createdAt: {
        type: GraphQLString,
        description: 'When it was created',
      },
      updatedAt: {
        type: GraphQLString,
        description: 'When it was udpated',
      },
    }),
    resolveType(instance) {
      return typesMap[instance.constructor.name];
    },
  });
  // debug(models);
  Object.assign(
    typesMap,
    mapValues(models, m => createType(m, modelInterface))
  );
  // debug('TypesMap');
  // debug(typesMap);
  let queryFieldsData = mapValues(typesMap, (v, name) => ({
    type: modelInterface,
    args: {
      id: {
        description: `id of the ${name}`,
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: (root, { id }) => models[name].findById(id),
  }));

  queryFieldsData = mapKeys(queryFieldsData, camelKey);
  // debug(queryFieldsData);
  const fields = () => queryFieldsData;

  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields,
  });

  return new GraphQLSchema({
    query: queryType,
    types: values(typesMap),
  });
}

export default createGraphQlRootQuery;
