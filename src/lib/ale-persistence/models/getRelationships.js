// @flow
import { mapValues } from 'lodash';
import { trace } from 'logger';
import { models } from '../index';
import type { JSON$Schema } from '../types';

function getRelationships(schema: JSON$Schema, Model: () => any): any {
  const { 'x-relationships': relationships }: JSON$Schema = schema;
  if (relationships == null) {
    return undefined;
  }
  return mapValues(relationships, relationship => {
    trace('creating relationship');
    trace(relationship);
    const { relation, modelClass, join } = relationship;
    return {
      relation: Model[relation],
      modelClass: models[modelClass],
      join,
    };
  });
}

export default getRelationships;
