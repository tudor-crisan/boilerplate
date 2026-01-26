/** @jest-environment node */
import { jest } from "@jest/globals";

describe("libs/mongo.js", () => {
  let importedMongo;
  let mongoClientMock;

  // This test is tricky because mongo.js executes at import time.
  // We strictly mock env vars and dependencies BEFORE import.

  beforeAll(async () => {
    // Mock Env
    process.env.MONGO_URI = "mongodb://localhost:27017";
    process.env.MONGO_DB = "/testdb";
    process.env.MONGO_QUERY = "?param=1";
    process.env.NODE_ENV = "production";

    // Mock mongodb package
    mongoClientMock = {
      connect: jest.fn().mockResolvedValue("connected-client"),
    };
    const MongoClientStub = jest.fn(() => mongoClientMock);

    jest.unstable_mockModule("mongodb", () => ({
      MongoClient: MongoClientStub,
      ServerApiVersion: { v1: "1" },
    }));

    jest.unstable_mockModule("@/libs/env", () => ({
      loadAppEnv: jest.fn(),
    }));

    importedMongo = await import("../../libs/mongo");
  });

  it("should export a client promise", async () => {
    const client = await importedMongo.default;
    expect(client).toBe("connected-client");
    expect(mongoClientMock.connect).toHaveBeenCalled();
  });
});
