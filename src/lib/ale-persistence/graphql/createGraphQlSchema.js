// @flow
import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { mapKeys, mapValues, values } from "lodash";
import { info } from "logger";
import { connectionDefinitions, connectionArgs } from "graphql-relay";
import {
  camelKey,
  pluralKey,
  resolveCollection,
  resolveSingleElement
} from "./selectors";
import { createObjectType } from "./generators";
import { elementQueryDefaults, stringMap, anyMap } from "./types";
import { nodeField, nodeInterface } from "./generators/nodeDefinitions";

function createGraphQlRootQuery(models: stringMap): GraphQLSchema {
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
      resolve: resolveSingleElement(name)
    })
  );

  elementQueryFields = mapKeys(elementQueryFields, camelKey);

  let collectionQueryFields = mapValues(typesMap, (v: any, name: string) => ({
    type: connectionsMap[name].connectionType,
    args: connectionArgs,
    resolve: resolveCollection(name)
  }));

  collectionQueryFields = mapKeys(collectionQueryFields, camelKey);
  collectionQueryFields = mapKeys(collectionQueryFields, pluralKey);

  const fields = () => ({
    ...elementQueryFields,
    ...collectionQueryFields,
    node: nodeField
  });

  const queryType = new GraphQLObjectType({
    name: "Query",
    fields
  });

  return new GraphQLSchema({
    query: queryType,
    types: values(typesMap)
  });
}

export default createGraphQlRootQuery;
