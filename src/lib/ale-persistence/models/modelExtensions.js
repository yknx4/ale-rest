/* @flow */
import { trace, log } from "logger";
import Cursor from "../utils/Cursor";
import { stringify64 } from "../utils/base64";

log(`modelExtensions.js`);

type node = { cursor: string, node: any };
function toNode(cursorData: Cursor, index: number, total: ?number): node {
  trace(`Converting into GraphQL node`);
  return {
    cursor: stringify64(cursorData.offsetCursor(index, total)),
    node: this
  };
}

export { toNode }; // eslint-disable-line import/prefer-default-export
