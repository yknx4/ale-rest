// @flow
import { reduce, pick } from 'lodash';
import { getPagingParameters } from 'relay-cursor-paging';
import { fromGlobalId } from 'graphql-relay';
import { stringify64 } from './base64';

const direction = (input: string): string =>
  input[0] === '-' ? 'DESC' : 'ASC';

const key = (input: string): string =>
  input[0] === '-' ? input.substr(1) : input;

function getOrderMap(orderArray: Array<string>): { [string]: string } {
  return reduce(
    orderArray,
    (a, v) => {
      a[key(v)] = direction(v); // eslint-disable-line no-param-reassign
      return a;
    },
    {}
  );
}

type paginable = {
  before: ?string,
  last: ?number,
  after: ?string,
  first: ?number,
};

type idType = string | number;

type orderArray = Array<string>;
type stringMap = { [string]: string };
type pageType = 'Page';
type pageGlobalId = { type: pageType, id: idType };
type cursoreable = { id: idType };

const array = (input): Array<string> =>
  Array.isArray(input) ? input : [input];

class Cursor {
  $orderBy: orderArray;
  $limit: ?number;
  $offset: ?number;
  $page: ?number;
  $orderBy = ['id'];

  set orderBy(order: Array<string> | string): void {
    this.$orderBy = array(order);
  }

  get orderMap(): stringMap {
    return getOrderMap(this.$orderBy);
  }

  set relayPagination(args: paginable) {
    const { after, before } = args;
    const globalId = after || before;
    if (globalId == null) {
      throw new TypeError('Invalid arguments');
    }
    const { id: page }: pageGlobalId = fromGlobalId((globalId: string));
    const { limit, offset } = getPagingParameters(args);
    this.$page = parseInt(page, 10);
    this.$limit = limit;
    this.$offset = offset;
  }

  get limit(): ?number {
    return this.$limit;
  }

  get offset(): ?number {
    return this.$offset;
  }

  get page(): ?number {
    return this.$page;
  }

  get cursor(): any {
    const { orderMap, limit, offset, page } = this;
    return {
      page,
      orderMap,
      limit,
      offset,
    };
  }

  cursorFor(input: cursoreable): cursoreable {
    const { id } = input;
    const attrs = pick(input, Object.keys(this.orderMap));
    return {
      id,
      ...attrs,
    };
  }

  toString() {
    return stringify64(this.cursor);
  }
}

export default Cursor;
