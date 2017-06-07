import { createSelector } from 'reselect';
import {
  getOutputFromInstance as resolve,
  getDescription as parseDescription,
} from '../selectors';
import { jsonSchemaTypeToGraphQlType } from '../types';
import logger from '~/logger'; // eslint-disable-line
const { info } = logger();

const getType = ({ type }) => type;
const getDescription = ({ description }) => description;

const generateField = createSelector(
  [getType, getDescription],
  (type, description): Object => {
    info(
      `Generating Field for type ${type} ${description != null
        ? ` with description ${description}`
        : ''}`
    );
    return {
      type: jsonSchemaTypeToGraphQlType(type),
      description: parseDescription(description),
      resolve,
    };
  }
);

export default generateField;
