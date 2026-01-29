/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";

describe("libs/env", () => {
  let loadAppEnv;
  let mockFs;
  let mockDotenv;

  beforeEach(async () => {
    jest.resetModules();

    mockFs = {
      existsSync: jest.fn().mockReturnValue(false),
    };
    mockDotenv = {
      config: jest.fn(),
    };

    jest.unstable_mockModule("fs", () => ({ default: mockFs }));
    jest.unstable_mockModule("dotenv", () => ({ default: mockDotenv }));

    // Mock process cwd
    jest.spyOn(process, "cwd").mockReturnValue("/mock/cwd");
    process.env.APP = "test-app";

    const mod = await import("../../modules/general/libs/env");
    loadAppEnv = mod.loadAppEnv;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.APP;
  });

  it("should do nothing if window is defined", () => {
    global.window = {};
    loadAppEnv();
    expect(mockFs.existsSync).not.toHaveBeenCalled();
    delete global.window;
  });

  it("should load env if exists", () => {
    mockFs.existsSync.mockReturnValue(true);
    loadAppEnv();

    expect(mockFs.existsSync).toHaveBeenCalledWith(
      expect.stringContaining("env-dev"),
    );
    expect(mockDotenv.config).toHaveBeenCalledWith(
      expect.objectContaining({
        path: expect.stringContaining("env-dev"),
        quiet: true,
      }),
    );
  });

  it("should not load if file missing", () => {
    mockFs.existsSync.mockReturnValue(false);
    loadAppEnv();
    expect(mockDotenv.config).not.toHaveBeenCalled();
  });

  it("should not run if no APP env var", () => {
    delete process.env.APP;
    delete process.env.NEXT_PUBLIC_APP;

    loadAppEnv();
    expect(mockFs.existsSync).not.toHaveBeenCalled();
  });
});
