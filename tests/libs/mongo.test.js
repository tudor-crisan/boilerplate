/** @jest-environment node */
import { jest } from "@jest/globals";

describe("libs/mongo.js", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should warn when MONGO_URI is missing", async () => {
    delete process.env.MONGO_URI;
    delete process.env.MONGO_DB;
    delete process.env.MONGO_QUERY;

    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    await import("../../libs/mongo.js");

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Invalid/Missing environment variable"),
    );

    consoleWarnSpy.mockRestore();
  });

  it("should create client when env vars are present", async () => {
    process.env.MONGO_URI = "mongodb://localhost:27017/";
    process.env.MONGO_DB = "testdb";
    process.env.MONGO_QUERY = "?retryWrites=true";
    process.env.NODE_ENV = "production";

    jest.unstable_mockModule("mongodb", () => ({
      MongoClient: jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockResolvedValue({}),
      })),
      ServerApiVersion: { v1: "1" },
    }));

    const mongo = await import("../../libs/mongo.js");
    expect(mongo.default).toBeDefined();
  });

  it("should use global cache in development", async () => {
    process.env.MONGO_URI = "mongodb://localhost:27017/";
    process.env.MONGO_DB = "testdb";
    process.env.MONGO_QUERY = "?retryWrites=true";
    process.env.NODE_ENV = "development";

    jest.unstable_mockModule("mongodb", () => ({
      MongoClient: jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockResolvedValue({}),
      })),
      ServerApiVersion: { v1: "1" },
    }));

    await import("../../libs/mongo.js");
    // In development, it should use global._mongoClientPromise
    expect(global._mongoClientPromise).toBeDefined();
  });
});
