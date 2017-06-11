import { onlyModels } from "./index";
import { utils } from "ale-persistence"; // eslint-disable-line

const { test: { build } } = utils;
const { User } = onlyModels;

const validAttributes = () => build(User.name);

const invalidEmailAttrs = () =>
  Object.assign({}, validAttributes(), { email: "invalidEmail" });

describe("User", () => {
  test("Model", () => {
    expect(User.name).toBe("User");
  });

  describe("Schema Validations", () => {
    it("should validate email", async () => {
      const user = new User(invalidEmailAttrs());
      const isValid = await user.validateWithSchema();
      const errors = user.schemaErrors;

      const expectError = expect(errors[0]);

      expect(isValid).toBeFalsy();
      expectError.toHaveProperty("dataPath", ".email");
      expectError.toHaveProperty("keyword", "format");
    });
  });

  describe("save", () => {
    it("should prevent save with invalid schema", async () => {
      const user = new User(invalidEmailAttrs());
      await expect(user.save()).rejects.toEqual(Error("Invalid Object"));
    });
  });
});
