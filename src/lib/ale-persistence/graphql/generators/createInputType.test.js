import { GraphQLInputObjectType } from 'graphql';
import createInputType from './createInputType';
import { jsonSchemaTypeToGraphQlType } from '../types';

describe('createInputType', () => {
  const schema = {
    title: 'Model',
    description: 'My Model Schema',
    properties: {
      prop: {
        type: 'string',
      },
      snake_case: {
        type: 'integer',
      },
    },
  };

  const expectedOutput = new GraphQLInputObjectType({
    name: 'ModelInput',
    fields: {
      prop: {
        type: jsonSchemaTypeToGraphQlType('string'),
      },
      snakeCase: {
        type: jsonSchemaTypeToGraphQlType('integer'),
      },
    },
    description: 'My Model Schema',
  });

  const model = () => {};
  model.schema = schema;

  it('creates an appropiate GraphQLInputObjectType based on a Model', () => {
    const result = createInputType(model);
    expect(result.toString()).toEqual('ModelInput');
    expect(result.name).toEqual('ModelInput');
    expect(result.description).toEqual('My Model Schema');
    expect(result).toBeInstanceOf(GraphQLInputObjectType);
    expect(result).toEqual(expectedOutput);
  });
});
