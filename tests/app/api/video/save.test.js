import { jest } from "@jest/globals";

describe("api/video/save", () => {
  let POST;
  let mockFs;
  let mockNextResponse;

  beforeEach(async () => {
    jest.resetModules();

    mockFs = {
      existsSync: jest.fn().mockReturnValue(true),
      readFileSync: jest
        .fn()
        .mockReturnValue(JSON.stringify({ videos: [{ id: "v1", data: {} }] })),
      writeFileSync: jest.fn(),
    };

    mockNextResponse = {
      json: jest.fn((data, opts) => ({
        ...data,
        ...opts,
        status: opts?.status || 200,
      })),
    };

    jest.unstable_mockModule("fs", () => ({ default: mockFs }));
    jest.unstable_mockModule("next/server", () => ({
      NextResponse: mockNextResponse,
    }));

    const mod = await import("../../../../app/api/video/save/route");
    POST = mod.POST;

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should successfully save video data", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        appId: "loyalboards",
        videoId: "v1",
        videoData: { title: "New Title" },
      }),
    };

    const res = await POST(req);

    expect(mockFs.writeFileSync).toHaveBeenCalled();
    const savedJson = JSON.parse(mockFs.writeFileSync.mock.calls[0][1]);
    expect(savedJson.videos[0].title).toBe("New Title");
    expect(res.success).toBe(true);
  });

  it("should return 400 if fields missing", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ appId: "test" }),
    };

    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(res.error).toBe("Missing required fields");
  });

  it("should return 404 if file not found", async () => {
    mockFs.existsSync.mockReturnValue(false);
    const req = {
      json: jest
        .fn()
        .mockResolvedValue({ appId: "missing", videoId: "v1", videoData: {} }),
    };

    const res = await POST(req);
    expect(res.status).toBe(404);
    expect(res.error).toBe("File not found");
  });

  it("should return 404 if video ID not in file", async () => {
    const req = {
      json: jest
        .fn()
        .mockResolvedValue({
          appId: "loyalboards",
          videoId: "v999",
          videoData: {},
        }),
    };

    const res = await POST(req);
    expect(res.status).toBe(404);
    expect(res.error).toBe("Video not found");
  });
});
