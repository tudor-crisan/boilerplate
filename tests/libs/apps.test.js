import { jest } from "@jest/globals";

describe("libs/apps", () => {
  let getAppDetails;

  beforeAll(async () => {
    jest.resetModules();

    // Mock lists
    jest.unstable_mockModule("@/lists/applications.mjs", () => ({
      default: {
        "test-app": {
          details: {
            appName: "Test App",
            website: "test.com",
            title: "Hero",
            description: "Desc",
            favicon: "/fav.ico",
          },
        },
        "bad-app": {
          // Missing details
        },
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
    expect(details.favicon).toBe("/fav.ico");
  });

  it("should return null for unknown app", () => {
    expect(getAppDetails("unknown")).toBeNull();
  });

  it("should return null if details missing", () => {
    expect(getAppDetails("bad-app")).toBeNull();
  });
});
