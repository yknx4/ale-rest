import { GraphQLInputObjectType } from 'graphql';

import { mapValues, mapKeys } from 'lodash';

import { camelKey } from '../selectors';
import { generateInputField } from './index';
import { info, log } from 'logger'; // eslint-disable-line

log(`createInputType.js`);
function createInputType(model: Function): GraphQLInputObjectType {
  const { schema } = model;
  const { title: name, properties, description } = schema;
  info(
    `Creating GraphQLInputObjectType for ${name}${description != null
      ? ` with description ${description}`
      : ''}`
  );
  // debug(properties);
  let fieldsData = mapValues(properties, generateInputField);
  fieldsData = mapKeys(fieldsData, camelKey);
  // debug(fieldsData);
  return new GraphQLInputObjectType({
    name: `${name}Input`,
    fields: fieldsData,
    description,
  });
}

export default createInputType;
