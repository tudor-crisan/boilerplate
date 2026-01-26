import { jest } from "@jest/globals";

describe("api/video assets (music, images, voiceover)", () => {
  let musicPOST, imagesGET, imagesPOST, voiceoverPOST;
  let mockFs;
  let mockNextResponse;

  beforeEach(async () => {
    jest.resetModules();

    mockFs = {
      existsSync: jest.fn().mockReturnValue(true),
      mkdirSync: jest.fn(),
      readFileSync: jest
        .fn()
        .mockReturnValue(
          JSON.stringify({ videos: [{ id: "v1", slides: [{ id: "s1" }] }] }),
        ),
      writeFileSync: jest.fn(),
      writeFile: jest.fn((p, d, cb) => cb(null)), // Execute callback for promisify
      promises: {
        writeFile: jest.fn().mockResolvedValue(undefined),
        readdir: jest.fn().mockResolvedValue(["im1.jpg", "other.txt"]),
        unlink: jest.fn().mockResolvedValue(undefined),
      },
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

    musicPOST = (await import("../../../../app/api/video/music/route")).POST;
    const imagesMod = await import("../../../../app/api/video/images/route");
    imagesGET = imagesMod.GET;
    imagesPOST = imagesMod.POST;
    voiceoverPOST = (await import("../../../../app/api/video/voiceover/route"))
      .POST;
  });

  describe("music", () => {
    it("should upload music and update video JSON", async () => {
      const formData = new Map([
        ["file", { arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) }],
        ["appId", "testApp"],
        ["videoId", "v1"],
        ["isGlobal", "true"],
      ]);
      const req = { formData: () => Promise.resolve(formData) };

      const res = await musicPOST(req);

      expect(mockFs.writeFile).toHaveBeenCalled();
      expect(mockFs.writeFileSync).toHaveBeenCalled();
      expect(res.success).toBe(true);
    });
  });

  describe("images", () => {
    it("GET should list image files", async () => {
      const res = await imagesGET();
      expect(res.images).toContain("im1.jpg");
      expect(res.images).not.toContain("other.txt");
    });

    it("POST should save uploaded image", async () => {
      const formData = new Map([
        [
          "file",
          {
            name: "test.png",
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
          },
        ],
      ]);
      const req = { formData: () => Promise.resolve(formData) };

      const res = await imagesPOST(req);
      expect(mockFs.promises.writeFile).toHaveBeenCalled();
      expect(res.success).toBe(true);
    });
  });

  describe("voiceover", () => {
    it("should upload voiceover and update specific slide", async () => {
      const formData = new Map([
        ["file", { arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) }],
        ["appId", "testApp"],
        ["videoId", "v1"],
        ["slideId", "s1"],
      ]);
      const req = { formData: () => Promise.resolve(formData) };

      const res = await voiceoverPOST(req);

      expect(mockFs.writeFileSync).toHaveBeenCalled();
      const saved = JSON.parse(mockFs.writeFileSync.mock.calls[0][1]);
      expect(saved.videos[0].slides[0].audio).toBeDefined();
      expect(res.success).toBe(true);
    });
  });
});
