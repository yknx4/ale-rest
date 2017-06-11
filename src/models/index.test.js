import models, { onlyModels } from "./index";

describe("index proxy", () => {
  it("should retrieve User model from proxy", () => {
    expect(models.User).toEqual(onlyModels.User); // eslint-disable-line
  });
});
