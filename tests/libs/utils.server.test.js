/** @jest-environment node */
import { jest } from "@jest/globals";

describe("libs/utils.server.js", () => {
  let utils;
  let NextResponseMock;

  beforeAll(async () => {
    NextResponseMock = {
      json: jest.fn((body, init) => ({ body, init })),
    };

    // Correctly mock ESM modules
    jest.unstable_mockModule("next/server", () => ({
      NextResponse: NextResponseMock,
    }));

    jest.unstable_mockModule("@/lists/blockedDomains", () => ({
      default: ["disposable.com"],
    }));

    // Start of day requires mocking date for getAnalyticsDateRange
    // mocking system time logic is handled inside tests or separate setup

    // Import the module under test
    utils = await import("../../libs/utils.server");
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe("formatWebsiteUrl", () => {
    it("should format url correctly", () => {
      expect(utils.formatWebsiteUrl("example.com")).toBe(
        "https://www.example.com",
      );
      expect(utils.formatWebsiteUrl("http://example.com")).toBe(
        "https://www.example.com",
      );
      expect(utils.formatWebsiteUrl("https://www.example.com")).toBe(
        "https://www.example.com",
      );
    });

    it("should return empty string for empty input", () => {
      expect(utils.formatWebsiteUrl("")).toBe("");
    });
  });

  describe("generateSlug", () => {
    it("should generate slug", () => {
      expect(utils.generateSlug("Test Name")).toBe("test-name");
    });

    it("should trim and limit length", () => {
      const longName = "a".repeat(40);
      expect(utils.generateSlug(longName, 10).length).toBe(10);
    });
  });

  describe("validateEmail", () => {
    it("should validate correct email", () => {
      expect(utils.validateEmail("user@example.com")).toEqual({
        isValid: true,
      });
    });

    it("should reject invalid email", () => {
      expect(utils.validateEmail("invalid-email")).toEqual({
        isValid: false,
        error: "Invalid email format",
      });
    });

    it("should reject empty email", () => {
      expect(utils.validateEmail("")).toEqual({
        isValid: false,
        error: "Email is required",
      });
    });

    it("should reject plus aliases", () => {
      expect(utils.validateEmail("user+alias@example.com")).toEqual({
        isValid: false,
        error: "Email aliases with '+' are not allowed",
      });
    });

    it("should reject disposable domains", () => {
      expect(utils.validateEmail("user@disposable.com")).toEqual({
        isValid: false,
        error: "Disposable email domains are not allowed",
      });
    });
  });

  describe("cleanObject", () => {
    it("should deep clone and clean object", () => {
      const date = new Date();
      const obj = {
        a: 1,
        date: date,
        nested: { b: 2 },
      };
      const cleaned = utils.cleanObject(obj);
      expect(cleaned.a).toBe(1);
      expect(cleaned.date).toBe(date.toISOString());
      expect(cleaned).not.toBe(obj);
    });

    it("should return null if obj is falsy", () => {
      expect(utils.cleanObject(null)).toBe(null);
    });
  });

  describe("getAnalyticsDateRange", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2023-01-15T12:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return correct range for 'today'", () => {
      const { startDate } = utils.getAnalyticsDateRange("today");
      expect(startDate.getFullYear()).toBe(2023);
      expect(startDate.getMonth()).toBe(0); // Jan is 0
      expect(startDate.getDate()).toBe(15);
      expect(startDate.getHours()).toBe(0);
      expect(startDate.getMinutes()).toBe(0);
      expect(startDate.getSeconds()).toBe(0);
    });
  });

  describe("responseSuccess", () => {
    it("should return NextResponse", () => {
      const res = utils.responseSuccess("ok", { id: 1 });
      expect(res.body).toEqual({ message: "ok", data: { id: 1 } });
      expect(res.init).toEqual({ status: 200 });
    });
  });
});
