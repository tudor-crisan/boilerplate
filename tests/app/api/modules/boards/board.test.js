import { jest } from "@jest/globals";

describe("api/modules/boards/board", () => {
  let POST, DELETE, PUT;
  let mockBoard, mockPost;
  let mockNextResponse;
  let mockUtils;

  beforeEach(async () => {
    jest.resetModules();

    mockBoard = {
      findOne: jest.fn(),
      create: jest.fn(),
      deleteOne: jest.fn(),
    };
    mockPost = {
      deleteMany: jest.fn(),
    };

    mockNextResponse = {
      json: jest.fn((data, opts) => ({
        ...data,
        ...opts,
        status: opts?.status || 200,
      })),
    };

    mockUtils = {
      generateSlug: jest.fn((name) => name.toLowerCase().replace(/ /g, "-")),
      responseSuccess: jest.fn((msg, data, status) => ({ msg, data, status })),
      responseError: jest.fn((msg, data, status) => ({ msg, data, status })),
    };

    jest.unstable_mockModule("@/modules/boards/models/Board", () => ({
      default: mockBoard,
    }));
    jest.unstable_mockModule("@/modules/boards/models/Post", () => ({
      default: mockPost,
    }));
    jest.unstable_mockModule("next/server", () => ({
      NextResponse: mockNextResponse,
    }));
    jest.unstable_mockModule("@/modules/general/libs/utils.server", () => mockUtils);
    jest.unstable_mockModule("next/cache", () => ({
      revalidatePath: jest.fn(),
    }));
    jest.unstable_mockModule("@/modules/general/libs/apiHandler", () => ({
      withApiHandler: (handler) => async (req) => {
        req.nextUrl = new URL(req.url || "http://localhost");
        return handler(req, { user: { _id: "user_123" } });
      },
    }));
    jest.unstable_mockModule("@/modules/general/libs/defaults", () => ({
      defaultSetting: {
        forms: {
          Board: {
            backend: {
              responses: {
                nameRequired: { message: "Name required", status: 400 },
                nameTooShort: { message: "Too short", status: 400 },
                createSuccesfully: { message: "Created", status: 201 },
                boardIdRequired: { message: "ID required", status: 400 },
                deleteSuccesfully: { message: "Deleted", status: 200 },
                updateSuccesfully: { message: "Updated", status: 200 },
                slugAlreadyInUse: { message: "Slug in use", status: 400 },
                rateLimitExceeded: { message: "Rate limit", status: 429 },
                slugTooShort: { message: "Slug short", status: 400 },
              },
            },
          },
        },
      },
    }));

    const mod =
      await import("../../../../../app/api/modules/boards/board/route");
    POST = mod.POST;
    DELETE = mod.DELETE;
    PUT = mod.PUT;
  });

  describe("POST", () => {
    it("should create a board", async () => {
      const req = { json: jest.fn().mockResolvedValue({ name: "My Board" }) };
      mockBoard.findOne.mockResolvedValue(null);
      mockBoard.create.mockResolvedValue({ _id: "b1", name: "My Board" });

      const res = await POST(req);

      expect(mockBoard.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "My Board" }),
      );
      expect(res.status).toBe(201);
      expect(res.msg).toBe("Created");
    });

    it("should return error if name is too short", async () => {
      const req = { json: jest.fn().mockResolvedValue({ name: "Ab" }) };
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(res.msg).toBe("Too short");
    });
  });

  describe("DELETE", () => {
    it("should delete a board and its posts", async () => {
      const req = {
        url: "http://localhost/api/modules/boards/board?boardId=b1",
      };
      const res = await DELETE(req);

      expect(mockBoard.deleteOne).toHaveBeenCalledWith({
        _id: "b1",
        userId: "user_123",
      });
      expect(mockPost.deleteMany).toHaveBeenCalledWith({ boardId: "b1" });
      expect(res.status).toBe(200);
    });

    it("should return error if boardId is missing", async () => {
      const req = { url: "http://localhost/api/modules/boards/board" };
      const res = await DELETE(req);
      expect(res.status).toBe(400);
    });
  });

  describe("PUT", () => {
    it("should update a board", async () => {
      const req = {
        json: jest.fn().mockResolvedValue({
          boardId: "b1",
          slug: "new-slug",
          name: "New Name",
        }),
      };
      const mockExistingBoard = {
        _id: "b1",
        userId: "user_123",
        slug: "old-slug",
        name: "Old Name",
        previousSlugs: [],
        save: jest.fn(),
      };
      mockBoard.findOne.mockImplementation((query) => {
        if (query._id === "b1") return Promise.resolve(mockExistingBoard);
        if (query.slug === "new-slug") return Promise.resolve(null);
        return Promise.resolve(null);
      });

      const res = await PUT(req);

      expect(mockExistingBoard.name).toBe("New Name");
      expect(mockExistingBoard.slug).toBe("new-slug");
      expect(mockExistingBoard.save).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });

    it("should return 404 if board not found", async () => {
      const req = {
        json: jest.fn().mockResolvedValue({ boardId: "missing", slug: "slug" }),
      };
      mockBoard.findOne.mockResolvedValue(null);
      const res = await PUT(req);
      expect(res.status).toBe(404);
    });
  });
});
