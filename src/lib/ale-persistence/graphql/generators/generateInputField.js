import { createSelector } from 'reselect';
import { jsonSchemaTypeToGraphQlType } from '../types';
import logger from '~/logger'; // eslint-disable-line
const { info } = logger();

const getType = ({ type }) => type;

const generateInputField = createSelector([getType], (type): Object => {
  info(`Generating Input Field for type ${type}`);
  return {
    type: jsonSchemaTypeToGraphQlType(type),
  };
});

export default generateInputField;
