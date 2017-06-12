import { isString, memoize } from "lodash";
import { trace, info, log } from "logger";
import plural from "pluralize";
import { camel } from "case";
import { models } from "ale-persistence";
import Cursor from "../utils/Cursor";
import { stringify64 } from "../utils/base64";

log(`selectors.js`);

function getOutputFromInstance(data, _, __, meta) {
  trace(`Getting ${meta.fieldName} from ${JSON.stringify(data)}`);
  return data[meta.fieldName];
}

const getDescription = description =>
  isString(description) ? description : "Missing Description";

const camelKey = (_, k) => camel(k);
const pluralKey = (_, k) => plural(k);

const resolveSingleElement = name => (root, { id }) =>
  models[name].loader().load(id);
const resolveCollection = name => async (ctx, args) => {
  const cursorData = new Cursor(args);
  const { page, limit, relativePosition } = cursorData;
  const Model = models[name];
  info(`page ${page} limit ${limit} rpos ${relativePosition}`);
  const start = (page - 1) * limit + relativePosition;
  const end = start + limit - 1;
  const result = await Model.query().select("id").range(start, end);
  info(result);
  const { results, total } = result;
  const ids = results.map(e => e.id);
  const data = await Model.loader().loadMany(ids);
  const parsed = data.map((e, i) =>
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
