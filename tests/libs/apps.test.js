import { jest } from "@jest/globals";

describe("libs/apps", () => {
  let getAppDetails;

  beforeAll(async () => {
    jest.resetModules();

    // Mock lists
    jest.unstable_mockModule("@/lists/applications.mjs", () => ({
      default: {
        "test-app": {
          copywriting: "copy-key",
          setting: { override: "set-key" }, // Test override object interaction
          visual: "vis-key",
          styling: "style-key",
        },
        "bad-app": {
          copywriting: "missing-key", // Will look up undefined
          setting: "set-key",
          visual: "vis-key",
          styling: "style-key",
        },
      },
    }));

    jest.unstable_mockModule("@/lists/copywritings.js", () => ({
      default: {
        "copy-key": { SectionHero: { headline: "Hero", paragraph: "Desc" } },
      },
    }));

    jest.unstable_mockModule("@/lists/settings.js", () => ({
      default: {
        "set-key": { appName: "Test App", website: "test.com" },
      },
    }));

    jest.unstable_mockModule("@/lists/stylings.js", () => ({
      default: {
        "style-key": { theme: "light" },
      },
    }));

    jest.unstable_mockModule("@/lists/visuals.js", () => ({
      default: {
        "vis-key": { favicon: { href: "/fav.ico" } },
      },
    }));

    jest.unstable_mockModule("@/libs/utils.server.js", () => ({
      formatWebsiteUrl: (url) => `https://${url}`,
    }));

    const mod = await import("../../libs/apps");
    getAppDetails = mod.getAppDetails;
  });

  it("should return details for valid app", () => {
    const details = getAppDetails("test-app");
    expect(details).toBeDefined();
    expect(details.title).toBe("Hero");
    expect(details.appName).toBe("Test App");
    expect(details.website).toBe("https://test.com");
  });

  it("should return null for unknown app", () => {
    expect(getAppDetails("unknown")).toBeNull();
  });

  it("should return null if config key missing", () => {
    expect(getAppDetails("bad-app")).toBeNull();
  });
});
