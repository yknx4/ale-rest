// @flow
import { nodeDefinitions, fromGlobalId } from 'graphql-relay';
import { typesStore } from 'ale-persistence/store';
import { debug } from 'logger';
import { modelsProxy } from '../../models';

const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId);
    return modelsProxy[type].loader().load(id);
  },
  obj => {
    debug(obj);
    return typesStore[obj.type];
  }
);

export { nodeInterface, nodeField };
