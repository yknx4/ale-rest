export type paginable = {
  before: ?string,
  last: ?number,
  after: ?string,
  first: ?number
};

export type idType = string | number;

export type orderArrayType = Array<string>;
export type stringMap = { [string]: string };
export type anyMap = { [string]: any };
export type pageType = "Page";
export type pageGlobalId = { type: pageType, id: idType };
export type cursoreable = { id: idType };
export type promisedCollection = Promise<Array<any>>;
export type seconds = number;
export type paginationType = {
  total_pages: number,
  current_page: number,
  first_page: number,
  last_page: number,
  previous_page: number,
  next_page: number,
  has_previous_page: boolean,
  has_next_page: boolean,
  total_results: number,
  results: number,
  first_result: number,
  last_result: number
};
