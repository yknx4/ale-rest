import { toGlobalId } from 'graphql-relay';
import Cursor from './Cursor';

const argsFor = { after: toGlobalId('Page', '1'), first: 5 };
const argsBack = { before: toGlobalId('Page', '10'), last: 5 };

describe('Cursor', () => {
  let cursor;
  beforeEach(() => {
    cursor = new Cursor();
    cursor.orderBy = ['id', '-created_at'];
  });

  it('should match forwards', () => {
    const expected = {
      limit: 5,
      offset: 2,
      orderMap: { created_at: 'DESC', id: 'ASC' },
      page: 1,
    };
    cursor.relayPagination = argsFor;

    expect(cursor.cursor).toEqual(expected);
  });

  it('should match backwards', () => {
    const expected = {
      limit: 5,
      offset: 5,
      orderMap: { created_at: 'DESC', id: 'ASC' },
      page: 10,
    };
    cursor.relayPagination = argsBack;

    expect(cursor.cursor).toEqual(expected);
  });

  it('should generate a cursor for an object', () => {
    const object = {
      id: '5',
      created_at: '11/12/94',
      another: 'ignored',
    };
    const singleCursor = cursor.cursorFor(object);
    expect(object).toMatchObject(singleCursor);
    expect(singleCursor).not.toHaveProperty('another');
  });
});
