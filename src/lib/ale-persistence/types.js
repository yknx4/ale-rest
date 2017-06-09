export type paginable = {
  before: ?string,
  last: ?number,
  after: ?string,
  first: ?number,
};

export type idType = string | number;

export type orderArrayType = Array<string>;
export type stringMap = { [string]: string };
export type pageType = 'Page';
export type pageGlobalId = { type: pageType, id: idType };
export type cursoreable = { id: idType };
export type promisedCollection = Promise<Array<any>>;
export type seconds = number;
