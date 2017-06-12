// @flow
import { info, log } from 'logger';
import { reduce, isNil, omitBy } from 'lodash';
import Paginator from 'paginator';
import { stringify64, parse64 } from './base64';
import type {
  paginable,
  orderArrayType,
  stringMap,
  pagination,
} from '../types';

log(`Cursos.js`);

const LINKS_DISPLAYED = 1;

// Arguments are `total_results` and `current_page`. I hope these are self
// explanatory.
// const pagination_info = paginator.build(10000, 50);

type cursorType = {
  orderBy: orderArrayType,
  pos: number,
  total: ?number,
};

type queryParameters = {
  orderBy: orderArrayType,
  limit: number,
  pos: number,
  total: ?number,
};

type toBeStringArray = string | Array<string>;

function inArray(input: toBeStringArray): Array<string> {
  return Array.isArray(input) ? input : [input];
}

const encodedData = ({ after, before }: paginable): ?string => after || before;
const encodedLimit = ({ first, last }: paginable): number =>
  first || last || 10;
function getDataFromParameters(args: paginable): queryParameters {
  const result = {
    limit: encodedLimit(args),
    orderBy: ['id'],
    pos: 0,
    total: null,
  };
  info(`Default ${stringify64(result)}`);
  const cursorData: ?string = encodedData(args);
  if (cursorData != null) {
    info(`Cursor ${cursorData}`);
    Object.assign(result, parse64(cursorData));
  }
  info(`Result: ${stringify64(result)}`);
  return result;
}

const direction = (input: string): string =>
  input[0] === '-' ? 'DESC' : 'ASC';

const key = (input: string): string =>
  input[0] === '-' ? input.substr(1) : input;

function getOrderMap(orderArray: orderArrayType): stringMap {
  return reduce(
    orderArray,
    (a, v: string) => {
      a[key(v)] = direction(v); // eslint-disable-line no-param-reassign
      return a;
    },
    {}
  );
}

function getOrderArray(orderMap: stringMap): orderArrayType {
  return reduce(
    orderMap,
    (a: orderArrayType, v: string, k: string): orderArrayType => {
      let order = v === 'DESC' ? '-' : '';
      order += k;
      a.push(order);
      return a;
    },
    []
  );
}

class Cursor {
  $orderBy: stringMap;
  $limit: number;
  $pos: number;
  $rpos: number;
  $paginator: any;

  constructor(args: paginable) {
    info(`Decoding ${stringify64(args)}`);
    const { orderBy, limit, pos }: queryParameters = getDataFromParameters(
      args
    );
    this.$orderBy = getOrderMap(inArray(orderBy));
    this.$limit = limit;
    this.$pos = pos;
    this.$rpos = this.$pos % limit;

    info(`limit ${limit} page ${pos / limit} rpos ${this.$rpos}`);
    this.$paginator = new Paginator(limit, LINKS_DISPLAYED);
    info(limit);
  }

  pagination(total: number, page: ?number): pagination {
    const paginatedPage: number = page || this.page;
    return this.$paginator.build(total, paginatedPage);
  }

  get page(): number {
    const { $pos, $limit } = this;
    const page = Math.ceil(($pos + 1) / $limit);
    return page < 1 ? 1 : page;
  }

  get limit(): number {
    return this.$limit;
  }

  get relativePosition(): number {
    return this.$rpos;
  }

  get currentCursor(): cursorType {
    const { $orderBy, $pos } = this;
    return omitBy(
      {
        orderBy: getOrderArray($orderBy),
        pos: $pos,
        total: null,
      },
      isNil
    );
  }

  offsetCursor(offset: number, total: ?number): cursorType {
    const current: cursorType = (Object.assign(
      { total },
      this.currentCursor
    ): cursorType);
    current.pos += offset;
    return omitBy(current, isNil);
  }

  cursorForPos(pos: number, total: ?number): cursorType {
    const { $orderBy } = this;
    return {
      orderBy: getOrderArray($orderBy),
      pos,
      total,
    };
  }
}

export default Cursor;
