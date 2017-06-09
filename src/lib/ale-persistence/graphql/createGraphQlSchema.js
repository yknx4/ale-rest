import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { mapKeys, mapValues, values } from 'lodash';
import { info } from 'logger';
import { connectionDefinitions, connectionArgs } from 'graphql-relay';
import {
  camelKey,
  pluralKey,
  // resolveCollection,
  resolveSingleElement,
} from './selectors';
import { createObjectType } from './generators';
import { elementQueryDefaults } from './types';
import { nodeField, nodeInterface } from './generators/nodeDefinitions';
import { modelsProxy } from '../models';

function createGraphQlRootQuery(models: { [string]: string }): GraphQLSchema {
  const typesMap = {};

  Object.assign(typesMap, mapValues(models, m => createObjectType(m)));

  const connectionsMap = mapValues(typesMap, m =>
    connectionDefinitions({ nodeType: m })
  );

  let elementQueryFields = mapValues(typesMap, (v, name) => ({
    ...elementQueryDefaults,
    type: nodeInterface,
    resolve: resolveSingleElement(name),
  }));

  elementQueryFields = mapKeys(elementQueryFields, camelKey);

  let collectionQueryFields = mapValues(typesMap, (v, name) => ({
    type: connectionsMap[name].connectionType,
    args: connectionArgs,
    async resolve(ctx, args) {
      const Model = modelsProxy[name];
      info(args);
      const { after, first } = args;
      let pagination;
      const raw = await Model.rawQuery().paginate(after, first).then(r => {
        pagination = r.pagination;
        info(r.results);
        return r.results;
      });
      info(pagination);
      const ids = raw.map(e => e.id);
      info(ids);
      const data = await Model.loader().loadMany(ids);
      const parsed = data.map(e => ({
        cursor: e.id,
        node: e,
      }));
      return {
        edges: parsed,
        pageInfo: {
          endCursor: JSON.stringify(pagination),
          startCursor: JSON.stringify(pagination),
          hasNextPage: true,
          hasPreviousPage: true,
        },
      };
      // info(a);
      // info(args);
      // info(req);
      // info(meta);
    },
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
