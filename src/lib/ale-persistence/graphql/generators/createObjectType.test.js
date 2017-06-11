import { GraphQLObjectType, GraphQLInterfaceType } from "graphql";
import diff from "jest-diff";
import createObjectType from "./createObjectType";
import { jsonSchemaTypeToGraphQlType } from "../types";
import { getOutputFromInstance as resolve, asFn } from "../selectors";
import { libState } from "ale-persistence/store";
import { nodeInterface } from "./nodeDefinitions";

describe("createObjectType", () => {
  const schema = {
    title: "Model",
    description: "My Model Schema",
    properties: {
      prop: {
        type: "string"
      },
      snake_case: {
        type: "integer"
      }
    }
  };

  const expectedOutput = new GraphQLObjectType({
    name: "Model",
    fields: asFn({
      prop: {
        type: jsonSchemaTypeToGraphQlType("string"),
        description: "desc",
        resolve
      },
      snakeCase: {
        type: jsonSchemaTypeToGraphQlType("integer"),
        description: "desc",
        resolve
      }
    }),
    description: "My Model Schema",
    interfaces: [nodeInterface]
  });

  const model = () => {};
  model.schema = schema;
  libState.bookshelf.model("ModelName", model);

  it("creates an appropiate GraphQLInputObjectType based on a Model", () => {
    const result = createObjectType("ModelName");
    // Small hack to ensure the output is the same at diff-wise but also to match with proper fields reference
    expect(
      diff(result, expectedOutput).replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ""
      )
    ).toContain("Compared values have no visual difference.");
    expectedOutput._typeConfig.fields = result._typeConfig.fields; // eslint-disable-line
    expect(result.toString()).toEqual("Model");
    expect(result.name).toEqual("Model");
    expect(result.description).toEqual("My Model Schema");
    expect(result).toBeInstanceOf(GraphQLObjectType);
    expect(result).toEqual(expectedOutput);
  });
});
