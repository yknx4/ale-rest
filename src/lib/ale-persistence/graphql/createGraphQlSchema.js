import {
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { mapKeys, mapValues, values } from 'lodash';
import {
  camelKey,
  pluralKey,
  resolveCollection,
  resolveSingleElement,
} from './selectors';
import { createInputType, createObjectType } from './generators';
import {
  defaultInputFields,
  elementQueryDefaults,
  modelInterfaceDefaults,
} from './types';

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
