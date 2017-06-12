import { isString, mapKeys, memoize } from "lodash";
import { trace, info } from "logger";
import plural from "pluralize";
import { camel } from "case";
import { models } from "ale-persistence";
import Cursor from "../utils/Cursor";
import type { paginable, idType, pagination } from "../types";
import { stringify64 } from "../utils/base64";

function getOutputFromInstance(
  data: Object,
  _: any,
  __: any,
  meta: Object
): any {
  trace(`Getting ${meta.fieldName} from ${JSON.stringify(data)}`);
  return data[meta.fieldName];
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
  const start = (page - 1) * limit + relativePosition;
  const end = start + limit - 1;
  const result = await Model.query().select("id").range(start, end);
  info(result);
  const { results, total } = result;
  const ids = results.map(e => e.id);
  const data = await Model.loader().loadMany(ids);
  const parsed = data.map((e: any, i: number): any =>
    e.toNode(cursorData, i + (1 || relativePosition), total)
  );
  const {
    has_next_page: hasNextPage,
    has_previous_page: hasPreviousPage
  }: pagination = cursorData.pagination(total);
  return {
    edges: parsed,
    pageInfo: {
      endCursor: stringify64(cursorData.cursorForPos(total, total)),
      startCursor: stringify64(cursorData.cursorForPos(1, total)),
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
  asFn
};
