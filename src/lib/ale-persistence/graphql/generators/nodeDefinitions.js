// @flow
import { nodeDefinitions, fromGlobalId } from "graphql-relay";
import { typesStore } from "ale-persistence/store";
import { debug } from "logger";
import { models } from "ale-persistence";

const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId);
    debug(`${type} ${id}`);
    return models[type].loader().load(id);
  },
  obj => {
    debug(obj);
    return typesStore[obj.type];
  }
);

export { nodeInterface, nodeField };
