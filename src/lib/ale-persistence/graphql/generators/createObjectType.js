import { GraphQLObjectType } from 'graphql';
import { mapValues, mapKeys } from 'lodash';
import { info } from 'logger'; // eslint-ignore-line
import { typesStore } from 'ale-persistence/store';
import { camelKey, asFn } from '../selectors';
import { generateField } from './index';
import { nodeInterface } from './nodeDefinitions';
import modelProxy from '../../models/modelsProxy';

function createObjectType(modelName: string): GraphQLObjectType {
  const model = modelProxy[modelName];
  const { schema } = model;
  const { title: name, description, properties } = schema;
  info(`Creating GraphQLObjectType for ${name}`);
  // debug(properties);
  let fieldsData = mapValues(properties, generateField);
  fieldsData = mapKeys(fieldsData, camelKey);
  // debug(fieldsData);
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
