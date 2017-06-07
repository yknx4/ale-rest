import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLList,
} from 'graphql';

import { mapValues, mapKeys, values } from 'lodash';

import {
  camelKey,
  pluralKey,
  resolveSingleElement,
  resolveCollection,
} from './selectors';
import {
  defaultInputFields,
  modelInterfaceDefaults,
  elementQueryDefaults,
} from './types';
import { createObjectType, createInputType } from './generators';

function createGraphQlRootQuery(models: Object): GraphQLSchema {
  const typesMap = {};
  const inputsMap = {};

  const modelInterface = new GraphQLInterfaceType({
    ...modelInterfaceDefaults,
    resolveType(instance) {
      return typesMap[instance.constructor.name];
    },
  });

  Object.assign(
    typesMap,
    mapValues(models, m => createObjectType(m, modelInterface))
  );

  Object.assign(inputsMap, mapValues(models, createInputType));

  let elementQueryFields = mapValues(typesMap, (v, name) => ({
    ...elementQueryDefaults,
    type: modelInterface,
    resolve: resolveSingleElement(models, name),
  }));

  elementQueryFields = mapKeys(elementQueryFields, camelKey);

  let collectionQueryFields = mapValues(typesMap, (v, name) => ({
    type: new GraphQLList(modelInterface),
    args: {
      ...defaultInputFields,
      query: {
        description: 'values to filter by',
        type: inputsMap[name],
      },
    },
    resolve: resolveCollection(models, name),
  }));

  collectionQueryFields = mapKeys(collectionQueryFields, camelKey);
  collectionQueryFields = mapKeys(collectionQueryFields, pluralKey);

  const fields = () => ({ ...elementQueryFields, ...collectionQueryFields });

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
