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

    jest.unstable_mockModule("@/libs/merge.mjs", () => ({
      getMergedConfig: jest.fn(
        (type, override, defaults) => defaults?.default || {},
      ),
      getMergedConfigWithModules: jest.fn((type, override, defaults) => ({
        forms: {
          testTarget: {
            mockConfig: {
              isEnabled: true,
              isError: false,
              responses: {
                success: { message: "Success", data: {}, status: 200 },
                error: { error: "Error", inputErrors: {}, status: 400 },
              },
            },
          },
        },
      })),
    }));

    jest.unstable_mockModule("@/libs/colors", () => ({
      oklchToHex: jest.fn(() => "#ff0000"),
    }));

    jest.unstable_mockModule("@/lists/themeColors", () => ({
      default: {
        light: { "--color-primary": "oklch(0.6 0.2 250)" },
      },
    }));

    jest.unstable_mockModule("@/lists/logos", () => ({
      default: {
        star: {
          path: ["M0 0h24v24H0z"],
          circle: [[12, 12, 5]],
          rect: [[0, 0, 24, 24, 4]],
        },
      },
    }));

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
    it("should return NextResponse success", () => {
      const res = utils.responseSuccess("ok", { id: 1 });
      expect(res.body).toEqual({ message: "ok", data: { id: 1 } });
      expect(res.init).toEqual({ status: 200 });
    });
  });

  describe("responseError", () => {
    it("should return NextResponse error", () => {
      const res = utils.responseError("fail", { field: "invalid" }, 400);
      expect(res.body).toEqual({
        error: "fail",
        inputErrors: { field: "invalid" },
      });
      expect(res.init).toEqual({ status: 400 });
    });
  });

  describe("responseMock", () => {
    it("should return success mock when enabled and not error", () => {
      const res = utils.responseMock("testTarget");
      expect(res.body.message).toBe("Success");
      expect(res.init.status).toBe(200);
    });

    it("should return false if mock is disabled", async () => {
      const { defaultSetting } = await import("@/libs/defaults");
      const original = defaultSetting.forms.testTarget.mockConfig.isEnabled;
      defaultSetting.forms.testTarget.mockConfig.isEnabled = false;
      expect(utils.responseMock("testTarget")).toBe(false);
      defaultSetting.forms.testTarget.mockConfig.isEnabled = original;
    });
  });

  describe("isResponseMock", () => {
    it("should return true if enabled", () => {
      expect(utils.isResponseMock("testTarget")).toBe(true);
    });

    it("should return false if not enabled", async () => {
      const { defaultSetting } = await import("@/libs/defaults");
      const original = defaultSetting.forms.testTarget.mockConfig.isEnabled;
      defaultSetting.forms.testTarget.mockConfig.isEnabled = false;
      expect(utils.isResponseMock("testTarget")).toBe(false);
      defaultSetting.forms.testTarget.mockConfig.isEnabled = original;
    });
  });

  describe("getBaseUrl", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it("should return localhost in development", () => {
      process.env.NODE_ENV = "development";
      expect(utils.getBaseUrl()).toBe("http://localhost:3000");
    });

    it("should return domain in production", () => {
      process.env.NODE_ENV = "production";
      process.env.NEXT_PUBLIC_DOMAIN = "example.com";
      expect(utils.getBaseUrl()).toBe("https://example.com");
    });

    it("should return empty string if domain missing in production", () => {
      process.env.NODE_ENV = "production";
      delete process.env.NEXT_PUBLIC_DOMAIN;
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      expect(utils.getBaseUrl()).toBe("");
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
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
      const { startDate, endDate } = utils.getAnalyticsDateRange("today");
      expect(startDate.getDate()).toBe(15);
      expect(startDate.getHours()).toBe(0);
      expect(endDate.getDate()).toBe(15);
    });

    it("should return correct range for 'yesterday'", () => {
      const { startDate, endDate } = utils.getAnalyticsDateRange("yesterday");
      expect(startDate.getDate()).toBe(14);
      expect(endDate.getDate()).toBe(14);
      expect(endDate.getHours()).toBe(23);
    });

    it("should return correct range for '7d'", () => {
      const { startDate } = utils.getAnalyticsDateRange("7d");
      expect(startDate.getDate()).toBe(8);
    });

    it("should return correct range for '30d'", () => {
      const { startDate } = utils.getAnalyticsDateRange("30d");
      const expectedDate = new Date("2023-01-15T00:00:00Z");
      expectedDate.setDate(expectedDate.getDate() - 30);
      expect(startDate.getDate()).toBe(expectedDate.getDate());
    });

    it("should return correct range for '3m'", () => {
      const { startDate } = utils.getAnalyticsDateRange("3m");
      expect(startDate.getMonth()).toBe(9); // October (0-indexed)
    });

    it("should return correct range for 'thisYear'", () => {
      const { startDate } = utils.getAnalyticsDateRange("thisYear");
      expect(startDate.getMonth()).toBe(0); // January
      expect(startDate.getDate()).toBe(1);
    });

    it("should return correct range for 'lastYear'", () => {
      const { startDate, endDate } = utils.getAnalyticsDateRange("lastYear");
      expect(startDate.getFullYear()).toBe(2022);
      expect(startDate.getMonth()).toBe(0);
      expect(endDate.getFullYear()).toBe(2022);
      expect(endDate.getMonth()).toBe(11);
    });

    it("should return default range for unknown value", () => {
      const { startDate } = utils.getAnalyticsDateRange("unknown");
      const expectedDate = new Date("2023-01-15T00:00:00Z");
      expectedDate.setDate(expectedDate.getDate() - 30);
      expect(startDate.getDate()).toBe(expectedDate.getDate());
    });
  });

  describe("generateLogoBase64", () => {
    it("should return data uri", () => {
      const styling = { theme: "light", components: { element: "rounded-md" } };
      const visual = { logo: { shape: "star" } };
      const result = utils.generateLogoBase64(styling, visual);
      expect(result).toContain("data:image/svg+xml;base64,");
    });

    it("should return empty string if missing args", () => {
      expect(utils.generateLogoBase64(null, null)).toBe("");
    });
  });
});
