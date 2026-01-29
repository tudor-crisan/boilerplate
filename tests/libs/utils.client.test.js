import {
  baseUrl,
  cn,
  createSlug,
  formattedDate,
  getEmailHandle,
  getNameInitials,
  isMobile,
  pluralize,
} from "@/modules/general/libs/utils.client";
import { jest } from "@jest/globals";

describe("libs/utils.client.js", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      expect(cn("class1", true && "class2", false && "class3")).toBe(
        "class1 class2",
      );
    });

    it("should merge tailwind classes", () => {
      expect(cn("p-4 p-2")).toBe("p-2");
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });
  });

  describe("getEmailHandle", () => {
    it("should return the handle from an email", () => {
      expect(getEmailHandle("test@example.com")).toBe("test");
      expect(getEmailHandle("user+tag@gmail.com")).toBe("user");
    });

    it("should return fallback if email is invalid or empty", () => {
      expect(getEmailHandle("", "fallback")).toBe("fallback");
      expect(getEmailHandle(null, "fallback")).toBe("fallback");
    });
  });

  describe("getNameInitials", () => {
    it("should return correct initials for single name", () => {
      expect(getNameInitials("Tudor")).toBe("TU");
      expect(getNameInitials("John")).toBe("JO");
    });

    it("should return first letter if name has numbers", () => {
      expect(getNameInitials("user123")).toBe("U");
    });

    it("should return first and last initials for full name", () => {
      expect(getNameInitials("Tudor Crisan")).toBe("TC");
      expect(getNameInitials("John Doe")).toBe("JD");
      expect(getNameInitials("First Middle Last")).toBe("FL");
    });

    it("should handle empty or null inputs", () => {
      expect(getNameInitials("")).toBe("");
      expect(getNameInitials(null)).toBe("");
    });
  });

  describe("isMobile", () => {
    beforeAll(() => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(), // Deprecated
          removeListener: jest.fn(), // Deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    it("should return true if media matches", () => {
      window.matchMedia.mockImplementation((query) => ({
        matches: true,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
      expect(isMobile()).toBe(true);
    });

    it("should return false if media does not match", () => {
      window.matchMedia.mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
      expect(isMobile()).toBe(false);
    });
  });

  describe("pluralize", () => {
    it("should pluralize words correctly", () => {
      expect(pluralize("cat", 0)).toBe("cats");
      expect(pluralize("cat", 1)).toBe("cat");
      expect(pluralize("cat", 2)).toBe("cats");
    });
  });

  describe("baseUrl", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it("should return localhost in development", () => {
      process.env.NODE_ENV = "development";
      expect(baseUrl()).toBe("http://localhost:3000");
    });

    it("should return domain in production", () => {
      process.env.NODE_ENV = "production";
      process.env.NEXT_PUBLIC_DOMAIN = "example.com";
      expect(baseUrl()).toBe("https://example.com");
    });

    it("should return empty string if no domain set in production", () => {
      process.env.NODE_ENV = "production";
      delete process.env.NEXT_PUBLIC_DOMAIN;
      expect(baseUrl()).toBe("");
    });
  });

  describe("getClientId", () => {
    beforeEach(() => {
      // Clear local storageMock
      window.localStorage.clear();
      jest.resetModules(); // Reset to clear module-level clientId variable
    });

    it("should return a clientId", async () => {
      // Note: Since getClientId uses a module-level variable that might persist across tests if modules aren't reset specific enough,
      // we rely on it functionality.
      // Ideally we would need to dynamically import the module to test the module-level caching cleanly.
      const { getClientId: getClientIdImport } =
        await import("../../modules/general/libs/utils.client");

      const id = getClientIdImport();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("should persist to localStorage", async () => {
      const { getClientId: getClientIdImport } =
        await import("../../modules/general/libs/utils.client");
      const id = getClientIdImport();
      expect(window.localStorage.getItem("x-client-id")).toBe(id);
    });
  });

  describe("createSlug", () => {
    it("should create a slug from name", () => {
      expect(createSlug("Test Name")).toBe("test-name");
      expect(createSlug("Test  Name")).toBe("test-name"); // Handles double space => hyphen?
      // utils says replace(/[^a-z0-9]+/g, "-") so "  " -> "-"
    });

    it("should trim hyphens if requested", () => {
      expect(createSlug("-Test Name-", true)).toBe("test-name");
    });

    it("should not trim hyphens if not requested", () => {
      expect(createSlug("-Test Name-", false)).toBe("-test-name-");
    });

    it("should truncate to 30 chars", () => {
      const longName = "a".repeat(40);
      expect(createSlug(longName).length).toBe(30);
    });
  });

  describe("formattedDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2023-01-01T12:00:00");
      // Output depends on locale, but checking for year/month presence is usually safe
      const formatted = formattedDate(date);
      expect(formatted).toContain("2023");
      expect(formatted).toContain("Jan"); // Short month
    });

    it("should handle invalid/null date", () => {
      expect(formattedDate(null)).toBe("");
    });
  });
});
