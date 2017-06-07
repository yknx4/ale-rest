import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from 'graphql';

const jsonSchemaTypeToGraphQlType = (type: ?string) =>
  ({
    string: GraphQLString,
    integer: new GraphQLNonNull(GraphQLInt),
  }[type] || GraphQLString);

const defaultInputFields = {
  order: {
    type: new GraphQLList(GraphQLString),
  },
  page: {
    type: GraphQLInt,
  },
  pageSize: {
    type: GraphQLInt,
  },
};

const modelInterfaceDefaults = {
  name: 'Model',
  description: 'A valid ale-rest Model',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The id of the model.',
    },
    createdAt: {
      type: GraphQLString,
      description: 'When it was created',
    },
    updatedAt: {
      type: GraphQLString,
      description: 'When it was udpated',
    },
  }),
};

const elementQueryDefaults = {
  args: {
    id: {
      description: `id of the element`,
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
};

export {
  jsonSchemaTypeToGraphQlType,
  defaultInputFields,
  modelInterfaceDefaults,
  elementQueryDefaults,
};
