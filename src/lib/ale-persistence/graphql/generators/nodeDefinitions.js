import { nodeDefinitions, fromGlobalId } from 'graphql-relay';
import { typesStore } from 'ale-persistence/store';
import { modelsProxy } from '../../db/getLoader';

const { nodeInterface, nodeField } = nodeDefinitions(globalId => {
  const { type, id } = fromGlobalId(globalId);
  return modelsProxy[type].loader().load(id);
}, obj => typesStore[obj.type]);

export { nodeInterface, nodeField };
