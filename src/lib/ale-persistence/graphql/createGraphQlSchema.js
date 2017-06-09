// @flow
import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { mapKeys, mapValues, values } from "lodash";
import { info } from "logger";
import {
  connectionDefinitions,
  connectionArgs,
  fromGlobalId,
  toGlobalId
} from "graphql-relay";
import {
  camelKey,
  pluralKey,
  // resolveCollection,
  resolveSingleElement
} from "./selectors";
import { createObjectType } from "./generators";
import { elementQueryDefaults } from "./types";
import { nodeField, nodeInterface } from "./generators/nodeDefinitions";
import { modelsProxy } from "../models";
import Cursor from "../utils/Cursor";
import { stringify64 } from "../utils/base64";

function createGraphQlRootQuery(models: { [string]: string }): GraphQLSchema {
  const typesMap = {};

  Object.assign(typesMap, mapValues(models, m => createObjectType(m)));

  const connectionsMap = mapValues(typesMap, m =>
    connectionDefinitions({ nodeType: m })
  );

  let elementQueryFields = mapValues(typesMap, (v, name) => ({
    ...elementQueryDefaults,
    type: nodeInterface,
    resolve: resolveSingleElement(name)
  }));

  elementQueryFields = mapKeys(elementQueryFields, camelKey);

  let collectionQueryFields = mapValues(typesMap, (v, name) => ({
    type: connectionsMap[name].connectionType,
    args: connectionArgs,
    async resolve(ctx, args) {
      info(fromGlobalId(args.after));
      const cursorData = new Cursor();
      cursorData.relayPagination = args;
      const { page, limit } = cursorData.cursor;
      info(cursorData.cursor);
      const Model = modelsProxy[name];
      const {
        pagination,
        results: resultsPromise
      } = await Model.rawQuery().paginate(page, limit);
      const {
        has_next_page: hasNextPage,
        has_previous_page: hasPreviousPage,
        first_page: firstPage,
        last_page: lastPage
      } = pagination;
      info(pagination);
      const results = await resultsPromise;
      const ids = results.map(e => e.id);
      info(ids);
      const data = await Model.loader().loadMany(ids);
      const parsed = data.map(e => ({
        cursor: stringify64(cursorData.cursorFor(e)),
        node: { attributes: mapKeys(e, camelKey) }
      }));
      return {
        edges: parsed,
        pageInfo: {
          endCursor: toGlobalId("Page", lastPage),
          startCursor: toGlobalId("Page", firstPage),
          hasNextPage,
          hasPreviousPage
        }
      };
      // info(a);
      // info(args);
      // info(req);
      // info(meta);
    }
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
