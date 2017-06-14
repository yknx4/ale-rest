import { createSelector } from 'reselect';
import { globalIdField } from 'graphql-relay';
import { trace, log } from 'logger';
import { getDescription as parseDescription } from '../selectors';
import { jsonSchemaTypeToGraphQlType } from '../types';

type fieldType = {
  type: any,
  description: string,
};

type schemaFieldType = {
  type: string,
  description: ?string,
};

log(`generateField.js`);
const getType = ({ type }): ?string => type;
const getDescription = ({ description }): ?string => description;
const getName = (_, name) => name;

const generateField: (schemaFieldType, string) => fieldType = createSelector(
  [getType, getDescription, getName],
  (type, description, name): fieldType => {
    trace(
      `Generating Field ${name} with type ${type} ${description != null
        ? ` with description ${description}`
        : ''}`
    );
    if (name === 'id') {
      return globalIdField();
    }
    return {
      type: jsonSchemaTypeToGraphQlType(type),
      description: parseDescription(description, name),
    };
  }
);

export default generateField;
