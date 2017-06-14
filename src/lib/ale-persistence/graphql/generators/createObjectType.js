import { GraphQLObjectType } from 'graphql';
import { mapValues, mapKeys } from 'lodash';
import { info, log } from 'logger';
import { typesStore } from 'ale-persistence/store';
import { models } from 'ale-persistence';
import { camelKey, asFn } from '../selectors';
import { generateField } from './index';
import { nodeInterface } from './nodeDefinitions';

log(`createObjectType.js`);
function createObjectType(modelName: string): GraphQLObjectType {
  const model = models[modelName];
  const { jsonSchema } = model;
  const { title: name, description, properties } = jsonSchema;
  info(`Creating GraphQLObjectType for ${name}`);
  // debug(properties);
  let fieldsData = mapValues(properties, generateField);
  fieldsData = mapKeys(fieldsData, camelKey);
  const fields = asFn(fieldsData);
  const newType = new GraphQLObjectType({
    name,
    description,
    fields,
    interfaces: [nodeInterface],
  });
  typesStore[name] = newType;
  return newType;
}

export default createObjectType;
