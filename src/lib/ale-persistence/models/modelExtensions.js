/* @flow */
import { trace, log } from 'logger';
import jsf from 'json-schema-faker';
import chance from 'chance';
import faker from 'faker';
import { Model, QueryBuilder } from 'objection';
import Cursor from '../utils/Cursor';
import { stringify64 } from '../utils/base64';
import type { JSON$Schema } from '../types';

jsf.extend('faker', () => faker);
jsf.extend('chance', () => chance);

log(`modelExtensions.js`);

type node = { cursor: string, node: any };
function toNode(cursorData: Cursor, index: number, total: ?number): node {
  trace(`Converting into GraphQL node`);
  return {
    cursor: stringify64(cursorData.offsetCursor(index, total)),
    node: this,
  };
}

type isBuildOptions = {
  includeTimestamps: ?boolean,
  includeId: ?boolean,
};

type anyFn = any => any;

const withFakeAttributes = (schema: JSON$Schema) => (
  fn: anyFn,
  transformFn: anyFn
): any => fn(transformFn(jsf(schema)));

function build(
  attrs: any = {},
  { includeTimestamps, includeId }: isBuildOptions = {
    includeTimestamps: false,
    includeId: false,
  }
): Model {
  const schema: JSON$Schema = Object.assign({}, this.jsonSchema);
  return withFakeAttributes(schema)(
    this.fromJson.bind(this),
    (attributes: any): any => {
      const $attr = Object.assign({}, attributes, attrs);
      trace('Generated Attributes');
      trace($attr);
      if (!includeTimestamps) {
        delete $attr.createdAt;
        delete $attr.updatedAt;
      }
      if (!includeId) {
        delete $attr.id;
      }
      return $attr;
    }
  );
}

function create(attrs: any = {}): QueryBuilder {
  const schema: JSON$Schema = Object.assign({}, this.jsonSchema);
  const query = this.query();
  return withFakeAttributes(schema)(
    query.insertAndFetch.bind(query),
    (attributes: any): any => {
      const $attr = Object.assign({}, attributes, attrs);
      trace('Generated Attributes');
      trace($attr);
      delete $attr.createdAt;
      delete $attr.updatedAt;
      delete $attr.id;
      return $attr;
    }
  );
}

export { toNode, build, create }; // eslint-disable-line import/prefer-default-export
