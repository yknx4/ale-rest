import { toGlobalId } from 'graphql-relay';
import Cursor from './Cursor';

const afterBefore = JSON.stringify({
  orderBy: ['id', '-created_at'],
  pos: 1470,
});

const pagination = {
  total_pages: 334,
  current_page: 50,
  first_page: 46,
  last_page: 53,
  previous_page: 49,
  next_page: 51,
  has_previous_page: true,
  has_next_page: true,
  total_results: 10000,
  results: 30,
  first_result: 1470,
  last_result: 1499,
};

const { first_result } = pagination;

const argsFor = { after: afterBefore, first: 30 };
const argsBack = { before: afterBefore, last: 30 };

describe('Cursor', () => {
  let cursor;

  it('should match', () => {
    const expected = { orderBy: ['id', '-created_at'], pos: 1470 };

    cursor = new Cursor(argsFor);

    expect(cursor.currentCursor).toEqual(expected);
  });

  // it("should generate a cursor for an object", () => {
  //   const object = {
  //     id: "5",
  //     created_at: "11/12/94",
  //     another: "ignored"
  //   };
  //   cursor = new Cursor(argsFor);
  //   cursor.orderBy = order;

  //   const singleCursor = cursor.cursorFor(object);
  //   expect(object).toMatchObject(singleCursor);
  //   expect(singleCursor).not.toHaveProperty("another");
  // });
});
