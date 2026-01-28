import { jest } from "@jest/globals";

describe("libs/defaults", () => {
  let defaults;

  beforeAll(async () => {
    jest.resetModules();

    // Mock environment
    process.env.APP = "test-app";

    // Mock lists
    jest.unstable_mockModule("@/lists/applications.mjs", () => ({
      default: {
        "test-app": {
          details: {
            appName: "Injected App",
            website: "injected.com",
            title: "Injected Title",
            description: "Injected Description",
            favicon: "/injected.ico",
          },
          copywriting: "copy-key",
          setting: "set-key",
          visual: "vis-key",
          styling: "style-key",
        },
      },
    }));

    jest.unstable_mockModule("@/lists/copywritings.js", () => ({
      default: {
        "copy-key": { SectionHero: { headline: "Old", paragraph: "Old" } },
      },
    }));

    jest.unstable_mockModule("@/lists/settings.js", () => ({
      default: {
        "set-key": { appName: "Old App", website: "old.com" },
      },
    }));

    jest.unstable_mockModule("@/lists/visuals.js", () => ({
      default: {
        "vis-key": { favicon: { href: "/old.ico" } },
      },
    }));

    // Mock other required lists
    jest.unstable_mockModule("@/lists/stylings.js", () => ({ default: {} }));
    jest.unstable_mockModule("@/modules/blog/lists/blogs.js", () => ({
      default: {},
    }));
    // Removed duplicate boards mock
    jest.unstable_mockModule("@/modules/help/lists/helps.js", () => ({
      default: {},
    }));
    jest.unstable_mockModule("@/lists/blockedDomains.js", () => ({
      default: [],
    }));
    jest.unstable_mockModule("@/lists/logos.js", () => ({ default: {} }));
    jest.unstable_mockModule("@/lists/themeColors.js", () => ({ default: {} }));

    // Mock JSON data modules
    jest.unstable_mockModule("@/modules/auth/data/auth.json", () => ({
      default: { paths: {}, rateLimits: {}, metadata: {}, auth: {} },
    }));
    jest.unstable_mockModule("@/modules/help/data/help.json", () => ({
      default: { paths: {}, rateLimits: {}, metadata: {} },
    }));
    jest.unstable_mockModule("@/modules/blog/data/blog.json", () => ({
      default: { paths: {}, rateLimits: {}, metadata: {} },
    }));

    // Fix boards mock to match structure expected by defaults.js (boards.boards)
    jest.unstable_mockModule("@/lists/boards.js", () => ({
      default: { boards: { paths: {}, rateLimits: {}, metadata: {} } },
    }));

    defaults = await import("../../libs/defaults");
  });

  it("should inject title and description into defaultCopywriting", () => {
    const { defaultCopywriting } = defaults;
    expect(defaultCopywriting.SectionHero.headline).toBe("Injected Title");
    expect(defaultCopywriting.SectionHero.paragraph).toBe(
      "Injected Description",
    );
  });

  it("should inject appName and website into defaultSetting", () => {
    const { defaultSetting } = defaults;
    expect(defaultSetting.appName).toBe("Injected App");
    expect(defaultSetting.website).toBe("injected.com");
  });

  it("should inject favicon into defaultVisual", () => {
    const { defaultVisual } = defaults;
    expect(defaultVisual.favicon.href).toBe("/injected.ico");
  });
});
