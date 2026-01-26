import { jest } from "@jest/globals";

describe("api/video export(s)", () => {
  let exportPOST, exportsGET;
  let mockFs, mockSpawn;
  let mockNextResponse;

  beforeEach(async () => {
    jest.resetModules();

    mockSpawn = { unref: jest.fn() };
    mockNextResponse = {
      json: jest.fn((data, opts) => ({
        ...data,
        ...opts,
        status: opts?.status || 200,
      })),
    };
    mockFs = {
      mkdir: jest.fn().mockResolvedValue(undefined),
      writeFile: jest.fn().mockResolvedValue(undefined),
      access: jest.fn().mockResolvedValue(undefined),
      readdir: jest.fn().mockResolvedValue(["v1_123.mp4", "v2_456.mp4"]),
      stat: jest
        .fn()
        .mockResolvedValue({
          ctime: new Date(),
          size: 1024,
          mtimeMs: Date.now(),
        }),
      unlink: jest.fn().mockResolvedValue(undefined),
      readFile: jest.fn().mockResolvedValue(JSON.stringify({ progress: 50 })),
      openSync: jest.fn().mockReturnValue(1),
    };

    jest.unstable_mockModule("fs/promises", () => ({ default: mockFs }));
    jest.unstable_mockModule("fs", () => ({
      default: { ...mockFs, openSync: mockFs.openSync },
    }));
    jest.unstable_mockModule("child_process", () => ({
      spawn: jest.fn().mockReturnValue(mockSpawn),
    }));
    jest.unstable_mockModule("next/server", () => ({
      NextResponse: mockNextResponse,
    }));

    exportPOST = (await import("../../../../app/api/video/export/route")).POST;
    exportsGET = (await import("../../../../app/api/video/exports/route")).GET;
  });

  describe("export", () => {
    it("should start background export process", async () => {
      const req = {
        json: jest.fn().mockResolvedValue({ videoId: "v1", styling: {} }),
      };
      const res = await exportPOST(req);

      expect(res.success).toBe(true);
      expect(res.message).toContain("Export started");
    });

    it("should return 400 if videoId missing", async () => {
      const req = { json: jest.fn().mockResolvedValue({}) };
      const res = await exportPOST(req);
      expect(res.status).toBe(400);
    });
  });

  describe("exports", () => {
    it("should list matching mp4 files", async () => {
      const req = { url: "http://localhost/api/video/exports?videoId=v1" };
      const res = await exportsGET(req);

      expect(res.exports).toHaveLength(1);
      expect(res.exports[0].filename).toBe("v1_123.mp4");
      expect(res.activeExport.progress).toBe(50);
    });
  });
});
