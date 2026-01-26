/** @jest-environment node */
import { jest } from "@jest/globals";

describe("libs/seo.js", () => {
  let getMetadata;
  let settingsMock;

  beforeAll(async () => {
    settingsMock = {
      appName: "TestApp",
      website: "example.com",
      seo: {
        title: "Default Title",
        description: "Default Desc",
        image: "default.jpg",
      },
      metadata: {
        home: {
          title: "Home | {appName}",
          description: "Welcome to {appName}",
        },
        article: {
          title: "{title}",
          description: "{description}",
        },
      },
    };

    jest.unstable_mockModule("@/libs/defaults", () => ({
      defaultSetting: settingsMock,
    }));

    const importedModule = await import("../../libs/seo");
    getMetadata = importedModule.getMetadata;
  });

  it("should return default metadata values handled by variables", () => {
    const meta = getMetadata("home");
    expect(meta.title).toBe("Home | TestApp");
    expect(meta.description).toBe("Welcome to TestApp");
    expect(meta.openGraph.url).toBe("https://example.com");
  });

  it("should replace variables in strings", () => {
    const meta = getMetadata("article", {
      title: "My Article",
      description: "Summary",
    });
    expect(meta.title).toBe("My Article");
    expect(meta.description).toBe("Summary");
  });

  it("should handle missing metadata target", () => {
    const meta = getMetadata("missing-target");
    expect(meta).toEqual({});
  });

  it("should use provided seoImage or default", () => {
    const meta = getMetadata("home", { seoImage: "custom.jpg" });
    expect(meta.openGraph.images[0].url).toBe("custom.jpg");
    expect(meta.twitter.images[0]).toBe("custom.jpg");
  });
});
