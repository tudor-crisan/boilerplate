import { jest } from "@jest/globals";

describe("libs/model", () => {
  let mockMongoose;
  let userSchemaConfig;
  let getUserModel;

  beforeEach(async () => {
    jest.resetModules();

    mockMongoose = {
      models: { User: "cached-model" },
      model: jest.fn(),
    };

    jest.unstable_mockModule("mongoose", () => ({ default: mockMongoose }));

    const mod = await import("../../modules/general/libs/model");
    userSchemaConfig = mod.userSchemaConfig;
    getUserModel = mod.getUserModel;
  });

  it("should export correct schema config", () => {
    expect(userSchemaConfig).toHaveProperty("name");
    expect(userSchemaConfig).toHaveProperty("email");
    expect(userSchemaConfig.email.lowercase).toBe(true);
    expect(userSchemaConfig.hasAccess.default).toBe(false);
  });

  it("should get user model", () => {
    expect(getUserModel({})).toBe("cached-model");

    mockMongoose.models.User = null;
    mockMongoose.model.mockReturnValue("new-model");
    expect(getUserModel({})).toBe("new-model");
  });
});
