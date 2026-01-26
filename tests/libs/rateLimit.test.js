/** @jest-environment node */
import { jest } from "@jest/globals";

describe("libs/rateLimit.js", () => {
  let checkRateLimit;
  let checkReqRateLimit;
  let RateLimitMock;
  let connectMongoMock;
  let settingsMock;

  beforeAll(async () => {
    // Mock DB
    connectMongoMock = jest.fn();
    RateLimitMock = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    // Mock Mongoose connection
    jest.unstable_mockModule("@/libs/mongoose", () => ({
      default: connectMongoMock,
    }));
    jest.unstable_mockModule("@/models/RateLimit", () => ({
      default: RateLimitMock,
    }));

    // Mock Settings
    settingsMock = {
      rateLimits: {
        "test-route": { limit: 5, window: 60 },
      },
      forms: {
        general: {
          backend: { responses: { serverError: { message: "Error" } } },
        },
      },
    };
    jest.unstable_mockModule("@/libs/defaults", () => ({
      defaultSetting: settingsMock,
    }));

    // Mock utils responseError
    jest.unstable_mockModule("@/libs/utils.server", () => ({
      responseError: (msg, err, status) => ({ error: msg, status }),
    }));

    const importedModule = await import("../../libs/rateLimit");
    checkRateLimit = importedModule.checkRateLimit;
    checkReqRateLimit = importedModule.checkReqRateLimit;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("checkRateLimit", () => {
    it("should allow if no record exists", async () => {
      RateLimitMock.findOne.mockResolvedValue(null);

      const res = await checkRateLimit("1.2.3.4", "test");

      expect(res.allowed).toBe(true);
      expect(RateLimitMock.create).toHaveBeenCalled();
    });

    it("should allow if window expired and reset count", async () => {
      const now = new Date("2023-01-01T12:00:00Z");
      jest.setSystemTime(now);

      const past = new Date(now.getTime() - 61 * 1000); // 61s ago
      const record = {
        firstRequest: past,
        requests: 10,
        save: jest.fn(),
      };
      RateLimitMock.findOne.mockResolvedValue(record);

      const res = await checkRateLimit("1.2.3.4", "test", 5, 60);

      expect(res.allowed).toBe(true);
      expect(record.requests).toBe(1); // reset
      expect(record.save).toHaveBeenCalled();
    });

    it("should block if limit exceeded in window", async () => {
      const now = new Date("2023-01-01T12:00:00Z");
      jest.setSystemTime(now);

      const recent = new Date(now.getTime() - 30 * 1000); // 30s ago
      const record = {
        firstRequest: recent,
        requests: 5, // Limit 5
        save: jest.fn(),
      };
      RateLimitMock.findOne.mockResolvedValue(record);

      const res = await checkRateLimit("1.2.3.4", "test", 5, 60);

      expect(res.allowed).toBe(false);
      expect(res.message).toContain("30 seconds"); // 60s window - 30s elapsed = 30s remaining
      expect(record.save).not.toHaveBeenCalled();
    });

    it("should increment if allowed in window", async () => {
      const now = new Date("2023-01-01T12:00:00Z");
      jest.setSystemTime(now);

      const recent = new Date(now.getTime() - 10 * 1000);
      const record = {
        firstRequest: recent,
        requests: 4, // Limit 5
        save: jest.fn(),
      };
      RateLimitMock.findOne.mockResolvedValue(record);

      const res = await checkRateLimit("1.2.3.4", "test", 5, 60);

      expect(res.allowed).toBe(true);
      expect(record.requests).toBe(5);
      expect(record.save).toHaveBeenCalled();
    });

    it("should fail open on error", async () => {
      RateLimitMock.findOne.mockRejectedValue(new Error("DB Connection Error"));
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const res = await checkRateLimit("1.2.3.4", "test");

      expect(res.allowed).toBe(true);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("checkReqRateLimit", () => {
    it("should use headers for IP", async () => {
      const req = { headers: { get: () => "10.0.0.1" } };
      RateLimitMock.findOne.mockResolvedValue(null);

      await checkReqRateLimit(req, "test-route");

      expect(RateLimitMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ ip: "10.0.0.1", route: "test-route" }),
      );
    });

    it("should return error response if blocked", async () => {
      RateLimitMock.findOne.mockImplementation(() => ({
        firstRequest: new Date(),
        requests: 100, // exceeded
      }));
      const req = { headers: { get: () => "10.0.0.1" } };

      const res = await checkReqRateLimit(req, "test-route"); // limit 5 from mock settings

      expect(res).toEqual({
        error: expect.stringContaining("Too many"),
        status: 429,
      });
    });
  });
});
