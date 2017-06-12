import { createSelector } from "reselect";
import { globalIdField } from "graphql-relay";
import { trace, log } from "logger";
import { getDescription as parseDescription } from "../selectors";
import { jsonSchemaTypeToGraphQlType } from "../types";

log(`generateField.js`);
const getType = ({ type }): ?string => type;
const getDescription = ({ description }): ?string => description;
const getName = (_, name) => name;

const generateField = createSelector(
  [getType, getDescription, getName],
  (type, description, name): Object => {
    trace(
      `Generating Field ${name} with type ${type} ${description != null
        ? ` with description ${description}`
        : ""}`
    );
    if (name === "id") {
      return globalIdField();
    }
    return {
      type: jsonSchemaTypeToGraphQlType(type),
      description: parseDescription(description)
    };
  }
);

export default generateField;
