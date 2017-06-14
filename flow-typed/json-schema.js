// @flow
/* eslint-disable no-undef, no-use-before-define */

declare type JSON$Pointer = {
  $ref: string
};

declare type JSON$SchemaReference = JSON$Pointer;

declare type JSON$SchemaPrimitiveType =
  | "array"
  | "boolean"
  | "integer"
  | "null"
  | "number"
  | "object"
  | "string";

declare type JSON$SchemaFieldsCommon = {
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

declare type JSON$SchemaNode<PrimitiveType: string, FieldsType: Object> = {
  type: PrimitiveType
} & FieldsType &
  JSON$SchemaFieldsCommon;

declare type JSON$SchemaArray = JSON$SchemaNode<
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

declare type JSON$SchemaBoolean = JSON$SchemaNode<
  "boolean",
  {
    default?: boolean
  }
>;

declare type JSON$SchemaInteger = JSON$SchemaNode<
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
declare type JSON$SchemaMixed = {
  type: JSON$SchemaPrimitiveType[],
  [keys: string]: mixed
} & JSON$SchemaFieldsCommon;

declare type JSON$SchemaNull = JSON$SchemaNode<
  "null",
  {
    default?: null
  }
>;

declare type JSON$SchemaNumber = JSON$SchemaNode<
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

declare type JSON$SchemaString = JSON$SchemaNode<
  "string",
  {
    default?: string,
    maxLength?: number,
    minLength?: number,
    pattern?: string
  }
>;

declare type JSON$SchemaObject = JSON$SchemaNode<
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

declare type JSON$Schema =
  | JSON$SchemaReference
  | JSON$SchemaBoolean
  | JSON$SchemaInteger
  | JSON$SchemaMixed
  | JSON$SchemaNull
  | JSON$SchemaNumber
  | JSON$SchemaString
  | JSON$SchemaArray
  | JSON$SchemaObject;

declare type JSON$RootSchema = JSON$Schema & {
  $schema: string
};
