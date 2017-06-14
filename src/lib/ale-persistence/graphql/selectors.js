// @flow
import { isString, memoize } from 'lodash';
import { trace, info, log } from 'logger';
import plural from 'pluralize';
import { camel, title } from 'case';
import { models } from 'ale-persistence';
import Cursor from '../utils/Cursor';
import { stringify64 } from '../utils/base64';

log(`selectors.js`);

type isMeta = {
  fieldName: string,
};

type isPrimitive = boolean | number | string;

function getOutputFromInstance(
  data: any,
  _: any,
  __: any,
  meta: isMeta
): isPrimitive {
  trace(`Getting ${meta.fieldName} from ${JSON.stringify(data)}`);
  return data[meta.fieldName];
}

const getDescription = (
  description: ?string,
  name: string = 'missing description'
): string => (isString(description) ? description : title(name));

const camelKey = (_: any, k: string): string => camel(k);
const pluralKey = (_: any, k: string): string => plural(k);

const executeQuery: () => Promise<any> = async (
  Model,
  $selectFields,
  $orderSql,
  $start,
  $end
) =>
  Model.query()
    .select(...$selectFields)
    .orderByRaw($orderSql)
    .range($start, $end)
    .cache()
    .then(resultData => resultData);

const resolveSingleElement = name => (root, { id }) => {
  info('resolving single');
  return models[name].loader().load(id);
};
const resolveCollection = name => async (ctx, args) => {
  const cursorData = new Cursor(args);
  const { page, limit, relativePosition, selectFields, orderSql } = cursorData;
  const Model = models[name];
  info(`page ${page} limit ${limit} rpos ${relativePosition}`);
  const start = (page - 1) * limit + relativePosition;
  const end = start + limit - 1;

  const result = await executeQuery(Model, selectFields, orderSql, start, end);
  info(result);
  const { results, total } = result;
  const ids = results.map(e => e.id);
  const data = await Model.loader().loadMany(ids);
  const parsed = data.map((e, i) =>
    e.toNode(cursorData, i + (1 || relativePosition), total)
  );
  const {
    has_next_page: hasNextPage,
    has_previous_page: hasPreviousPage,
  } = cursorData.pagination(total);
  const response = {
    edges: parsed,
    pageInfo: {
      endCursor: stringify64(cursorData.cursorForPos(total, total)),
      startCursor: stringify64(cursorData.cursorForPos(1, total)),
      hasNextPage,
      hasPreviousPage,
    },
  };
  return response;
};

const asFn = memoize(input => () => input);

export {
  getOutputFromInstance,
  getDescription,
  camelKey,
  pluralKey,
  resolveSingleElement,
  resolveCollection,
  asFn,
};
