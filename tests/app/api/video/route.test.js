import { jest } from "@jest/globals";

describe("api/video/route", () => {
  let GET, POST, DELETE;
  let mockFs;
  let mockNextResponse;

  beforeEach(async () => {
    jest.resetModules();
    process.env.NEXT_PUBLIC_APP = "loyalboards";

    mockFs = {
      readFile: jest
        .fn()
        .mockResolvedValue(
          JSON.stringify({ videos: [{ id: "1", title: "Video 1" }] }),
        ),
      writeFile: jest.fn().mockResolvedValue(undefined),
    };

    mockNextResponse = {
      json: jest.fn((data, opts) => ({
        ...data,
        ...opts,
        status: opts?.status || 200,
      })),
    };

    jest.unstable_mockModule("fs/promises", () => ({ default: mockFs }));
    jest.unstable_mockModule("next/server", () => ({
      NextResponse: mockNextResponse,
    }));

    const mod = await import("../../../../app/api/video/route");
    GET = mod.GET;
    POST = mod.POST;
    DELETE = mod.DELETE;

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("GET should return videos from file", async () => {
    const res = await GET();
    expect(res.success).toBe(true);
    expect(res.videos).toHaveLength(1);
    expect(res.videos[0].id).toBe("1");
  });

  it("POST should update existing video", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ id: "1", title: "Updated Video" }),
    };

    const res = await POST(req);

    expect(mockFs.writeFile).toHaveBeenCalled();
    const writeData = JSON.parse(mockFs.writeFile.mock.calls[0][1]);
    expect(writeData.videos[0].title).toBe("Updated Video");
    expect(res.success).toBe(true);
  });

  it("POST should add new video", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ id: "2", title: "New Video" }),
    };

    await POST(req);

    const writeData = JSON.parse(mockFs.writeFile.mock.calls[0][1]);
    expect(writeData.videos).toHaveLength(2);
    expect(writeData.videos[1].id).toBe("2");
  });

  it("DELETE should remove video by ID", async () => {
    const req = {
      url: "http://localhost:3000/api/video?id=1",
    };

    const res = await DELETE(req);

    expect(mockFs.writeFile).toHaveBeenCalled();
    const writeData = JSON.parse(mockFs.writeFile.mock.calls[0][1]);
    expect(writeData.videos).toHaveLength(0);
    expect(res.success).toBe(true);
  });

  it("DELETE should return 404 if video not found", async () => {
    const req = {
      url: "http://localhost:3000/api/video?id=999",
    };

    const res = await DELETE(req);
    expect(res.status).toBe(404);
    expect(res.success).toBe(false);
  });

  it("DELETE should return 400 if ID missing", async () => {
    const req = {
      url: "http://localhost:3000/api/video",
    };

    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
