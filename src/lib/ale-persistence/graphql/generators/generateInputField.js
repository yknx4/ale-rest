import { createSelector } from 'reselect';
import { jsonSchemaTypeToGraphQlType } from '../types';
import { trace } from 'logger'; // eslint-disable-line

const getType = ({ type }): ?string => type;

const generateInputField = createSelector([getType], (type): Object => {
  trace(`Generating Input Field for type ${type}`);
  return {
    type: jsonSchemaTypeToGraphQlType(type),
  };
});

export default generateInputField;
