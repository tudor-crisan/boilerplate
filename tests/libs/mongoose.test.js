/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";

describe("libs/mongoose", () => {
  let connectMongo;
  let mockMongoose;

  beforeEach(async () => {
    jest.resetModules();
    process.env.MONGO_URI = "mongodb://localhost:27017/";
    process.env.MONGO_DB = "testdb";
    process.env.MONGO_QUERY = "?authSource=admin";

    mockMongoose = {
      connect: jest.fn().mockResolvedValue("connected"),
      connection: { readyState: 1 },
    };

    jest.unstable_mockModule("mongoose", () => ({ default: mockMongoose }));
    jest.unstable_mockModule("@/modules/general/libs/env", () => ({
      loadAppEnv: jest.fn(),
    }));

    const mod = await import("../../modules/general/libs/mongoose");
    connectMongo = mod.default;

    // Clear cache
    if (global.mongoose) {
      global.mongoose.conn = null;
      global.mongoose.promise = null;
    }
  });

  it("should create new connection if none cached", async () => {
    const conn = await connectMongo();
    expect(mockMongoose.connect).toHaveBeenCalled();
    expect(conn).toBe("connected");
  });

  it("should use cached connection if available", async () => {
    await connectMongo(); // first call
    mockMongoose.connect.mockClear();

    const conn = await connectMongo(); // cached
    expect(mockMongoose.connect).not.toHaveBeenCalled();
    expect(conn).toBe("connected");
  });

  it("should return existing promise if connecting", async () => {
    // Mock slow connection
    let resolveConn;
    mockMongoose.connect.mockReturnValue(new Promise((r) => (resolveConn = r)));

    const p1 = connectMongo();
    const p2 = connectMongo();

    expect(mockMongoose.connect).toHaveBeenCalledTimes(1);

    resolveConn("connected");
    await expect(p1).resolves.toBe("connected");
    await expect(p2).resolves.toBe("connected");
  });

  it("should handle connection error", async () => {
    mockMongoose.connect.mockRejectedValue(new Error("Connection failed"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(connectMongo()).rejects.toThrow("Connection failed");

    // Should clear promise so retry works
    expect(global.mongoose.promise).toBeNull();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Mongoose error"));
    spy.mockRestore();
  });

  it("should skip if env vars missing", async () => {
    delete process.env.MONGO_URI;
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const res = await connectMongo();
    expect(res).toBeUndefined();
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("Invalid/Missing"),
    );
  });
});
