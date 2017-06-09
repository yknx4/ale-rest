// @flow
import { isString, mapKeys, memoize } from 'lodash';
import { trace } from 'logger';
import plural from 'pluralize';
import { camel } from 'case';
import { modelsProxy as models } from 'ale-persistence/models';
import { toGlobalId } from 'graphql-relay';
import Cursor from '../utils/Cursor';
import { paginable, idType } from '../types';

const instanceToResult = memoize((instance): { [string]: any } =>
  mapKeys(instance.attributes, (_, key) => camel(key))
);

function getOutputFromInstance(
  data: Object,
  _: any,
  __: any,
  meta: Object
): any {
  trace(`Getting ${meta.fieldName} from ${JSON.stringify(data)}`);
  const transformedData = instanceToResult(data);
  return transformedData[meta.fieldName];
}

const getDescription = (description: ?string): string =>
  isString(description) ? description : 'Missing Description';

const camelKey = (_: any, k: string): string => camel(k);
const pluralKey = (_: any, k: string): string => plural(k);

const resolveSingleElement = (name: string) => (
  root: any,
  { id }: { id: idType }
) => models[name].loader().load(id);
const resolveCollection = (name: string) => async (
  ctx: any,
  args: paginable
) => {
  const cursorData = new Cursor();
  cursorData.relayPagination = args;
  const { page, limit } = cursorData.cursor;
  const Model = models[name];
  const {
    pagination,
    results: resultsPromise,
  } = await Model.rawQuery().paginate(page, limit);
  const {
    has_next_page: hasNextPage,
    has_previous_page: hasPreviousPage,
    first_page: firstPage,
    last_page: lastPage,
  } = pagination;
  const results = await resultsPromise;
  const ids = results.map(e => e.id);
  const data = await Model.loader().loadMany(ids);
  const parsed = data.map(e => e.toNode(cursorData));
  return {
    edges: parsed,
    pageInfo: {
      endCursor: toGlobalId('Page', lastPage),
      startCursor: toGlobalId('Page', firstPage),
      hasNextPage,
      hasPreviousPage,
    },
  };
};

const asFn = memoize(input => () => input);

export {
  getOutputFromInstance,
  getDescription,
  camelKey,
  pluralKey,
  resolveSingleElement,
  resolveCollection,
  instanceToResult,
  asFn,
};
