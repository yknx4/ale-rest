// @flow
import { nodeDefinitions, fromGlobalId } from 'graphql-relay';
import { typesStore } from 'ale-persistence/store';
import { debug, log } from 'logger';
import { models } from 'ale-persistence';

log(`nodeDefinitions.js`);
const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId);
    debug(`${type} ${id}`);
    models[type].loader().load(id).then(debug);
    return models[type].loader().load(id);
  },
  obj => {
    debug(obj);
    return typesStore[obj.type];
  }
);

export { nodeInterface, nodeField };
