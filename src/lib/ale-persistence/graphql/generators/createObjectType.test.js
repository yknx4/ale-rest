import { GraphQLObjectType, GraphQLInterfaceType } from 'graphql';
import diff from 'jest-diff';
import createObjectType from './createObjectType';
import { jsonSchemaTypeToGraphQlType } from '../types';
import { getOutputFromInstance as resolve, asFn } from '../selectors';

describe('createObjectType', () => {
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

  const interfaceType = new GraphQLInterfaceType({ name: 'interface' });

  const expectedOutput = new GraphQLObjectType({
    name: 'ModelObjectType',
    fields: asFn({
      prop: {
        type: jsonSchemaTypeToGraphQlType('string'),
        description: 'desc',
        resolve,
      },
      snakeCase: {
        type: jsonSchemaTypeToGraphQlType('integer'),
        description: 'desc',
        resolve,
      },
    }),
    description: 'My Model Schema',
    interfaces: [interfaceType],
  });

  const model = () => {};
  model.schema = schema;

  it('creates an appropiate GraphQLInputObjectType based on a Model', () => {
    const result = createObjectType(model, interfaceType);
    // Small hack to ensure the output is the same at diff-wise but also to match with proper fields reference
    expect(
      diff(result, expectedOutput).replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ''
      )
    ).toEqual('Compared values have no visual difference.');
    expectedOutput._typeConfig.fields = result._typeConfig.fields; // eslint-disable-line
    expect(result.toString()).toEqual('ModelObjectType');
    expect(result.name).toEqual('ModelObjectType');
    expect(result.description).toEqual('My Model Schema');
    expect(result).toBeInstanceOf(GraphQLObjectType);
    expect(result).toEqual(expectedOutput);
  });
});
