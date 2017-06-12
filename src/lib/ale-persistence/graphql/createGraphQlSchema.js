// @flow
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { mapKeys, mapValues, values } from 'lodash';
import { info, log } from 'logger';
import { connectionDefinitions, connectionArgs } from 'graphql-relay';
import {
  camelKey,
  pluralKey,
  resolveCollection,
  resolveSingleElement,
} from './selectors';
import { createObjectType } from './generators';
import { elementQueryDefaults } from './types';
import type { stringMap, anyMap } from '../types';
import { nodeField, nodeInterface } from './generators/nodeDefinitions';

log(`createGraphQlSchema`);
function createGraphQlRootQuery(models: stringMap): GraphQLSchema {
  info(`Creating Schema from ${Object.keys(models).join(', ')}.`);
  const typesMap = {};

  Object.assign(
    typesMap,
    mapValues(models, (m: string) => createObjectType(m))
  );

  const connectionsMap = mapValues(typesMap, (m): anyMap =>
    connectionDefinitions({ nodeType: m })
  );

  let elementQueryFields = mapValues(
    typesMap,
    (v: any, name: string): anyMap => ({
      ...elementQueryDefaults,
      type: nodeInterface,
      resolve: resolveSingleElement(name),
    })
  );

  elementQueryFields = mapKeys(elementQueryFields, camelKey);

  let collectionQueryFields = mapValues(typesMap, (v: any, name: string) => ({
    type: connectionsMap[name].connectionType,
    args: connectionArgs,
    resolve: resolveCollection(name),
  }));

  collectionQueryFields = mapKeys(collectionQueryFields, camelKey);
  collectionQueryFields = mapKeys(collectionQueryFields, pluralKey);

  const fields = () => ({
    ...elementQueryFields,
    ...collectionQueryFields,
    node: nodeField,
  });

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
