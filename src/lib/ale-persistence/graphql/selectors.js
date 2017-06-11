// @flow
import { isString, mapKeys, memoize } from "lodash";
import { trace, info } from "logger";
import plural from "pluralize";
import { camel } from "case";
import { modelsProxy as models } from "ale-persistence/models";
import { toGlobalId } from "graphql-relay";
import Cursor from "../utils/Cursor";
import { paginable, idType, paginationType } from "../types";
import { stringify64 } from "../utils/base64";

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
  isString(description) ? description : "Missing Description";

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
  const cursorData = new Cursor(args);
  const { page, limit, relativePosition } = cursorData;
  const Model: Function = models[name];
  info(`page ${page} limit ${limit} rpos ${relativePosition}`);
  const {
    pagination,
    results: resultsPromise
  }: {
    pagination: paginationType,
    results: any
  } = await Model.rawQuery().paginate(page, limit, relativePosition);
  const {
    has_next_page: hasNextPage,
    has_previous_page: hasPreviousPage,
    total_pages: lastPage,
    total_results: total
  } = pagination;
  const results = await resultsPromise;
  const ids = results.map(e => e.id);
  const data = await Model.loader().loadMany(ids);
  const parsed = data.map((e: any, i: number): any =>
    e.toNode(cursorData, i + (1 || relativePosition), total)
  );
  info(parsed);
  info(pagination);
  return {
    edges: parsed,
    pageInfo: {
      endCursor: stringify64(cursorData.cursorForPage(lastPage, limit, total)),
      startCursor: stringify64(cursorData.cursorForPage(1, 1, total)),
      hasNextPage,
      hasPreviousPage
    }
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
  asFn
};
