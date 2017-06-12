// @flow
/* eslint-disable no-undef, no-use-before-define */
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

export type JSON$Pointer = {
  $ref: string
};

export type JSON$SchemaReference = JSON$Pointer;

export type JSON$SchemaPrimitiveType =
  | "array"
  | "boolean"
  | "integer"
  | "null"
  | "number"
  | "object"
  | "string";

export type JSON$SchemaFieldsCommon = {
  allOf?: JSON$Schema[],
  anyOf?: JSON$Schema[],
  definitions?: {
    [keys: string]: JSON$Schema
  },
  description?: string,
  enum?: JSON$Value[],
  id?: string,
  not?: JSON$Schema,
  oneOf?: JSON$Schema[],
  title?: string,
  order?: number // FIXME: try to make this a parameter
};

export type JSON$SchemaNode<PrimitiveType: string, FieldsType: Object> = {
  type: PrimitiveType
} & FieldsType &
  JSON$SchemaFieldsCommon;

export type JSON$SchemaArray = JSON$SchemaNode<
  "array",
  {
    default?: JSON$Value[],
    additionalItems?: boolean | JSON$Schema,
    items?: JSON$Schema[] | JSON$Schema,
    maxItems?: number,
    minItems?: number,
    uniqueItems?: boolean
  }
>;

export type JSON$SchemaBoolean = JSON$SchemaNode<
  "boolean",
  {
    default?: boolean
  }
>;

export type JSON$SchemaInteger = JSON$SchemaNode<
  "integer",
  {
    default?: number,
    multipleOf?: number,
    maximum?: number,
    minimum?: number,
    exclusiveMaximum?: boolean,
    exclusiveMinimum?: boolean
  }
>;

// FIXME: I think we need some sort of computation to do this more accurately
export type JSON$SchemaMixed = {
  type: JSON$SchemaPrimitiveType[],
  [keys: string]: mixed
} & JSON$SchemaFieldsCommon;

export type JSON$SchemaNull = JSON$SchemaNode<
  "null",
  {
    default?: null
  }
>;

export type JSON$SchemaNumber = JSON$SchemaNode<
  "number",
  {
    default?: number,
    multipleOf?: number,
    maximum?: number,
    minimum?: number,
    exclusiveMaximum?: boolean,
    exclusiveMinimum?: boolean
  }
>;

export type JSON$SchemaString = JSON$SchemaNode<
  "string",
  {
    default?: string,
    maxLength?: number,
    minLength?: number,
    pattern?: string
  }
>;

export type JSON$SchemaObject = JSON$SchemaNode<
  "object",
  {
    additionalProperties?: boolean | JSON$Schema,
    dependencies?: {
      [keys: string]: string[] | JSON$Schema
    },
    maxProperties?: number,
    minProperties?: number,
    patternProperties?: {
      [keys: string]: JSON$Schema
    },
    properties?: {
      [keys: string]: JSON$Schema
    },
    required?: string[]
  }
>;

export type JSON$CustomProperties = {
  tableName: string
};

export type JSON$Schema =
  | JSON$SchemaReference
  | JSON$SchemaBoolean
  | JSON$SchemaInteger
  | JSON$SchemaMixed
  | JSON$SchemaNull
  | JSON$SchemaNumber
  | JSON$SchemaString
  | JSON$SchemaArray
  | JSON$SchemaObject
  | JSON$CustomProperties;

export type JSON$RootSchema = JSON$Schema & {
  $schema: string
};
