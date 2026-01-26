import { jest } from "@jest/globals";

describe("api/modules/boards/post", () => {
  let POST, DELETE, GET;
  let mockPost, mockBoard, mockAnalytics, mockUtils;

  beforeEach(async () => {
    jest.resetModules();

    mockPost = {
      create: jest.fn(),
      findById: jest.fn(),
      deleteOne: jest.fn(),
      aggregate: jest.fn().mockReturnValue([{ id: "p1", title: "Post 1" }]),
    };
    mockBoard = {
      findOne: jest.fn(),
      findById: jest.fn(),
    };
    mockAnalytics = {
      trackEvent: jest.fn().mockResolvedValue({}),
      createNotification: jest.fn().mockResolvedValue({}),
    };
    mockUtils = {
      responseSuccess: jest.fn((msg, data, status) => ({
        msg,
        data,
        status,
        statusText: "OK",
        ok: true,
      })),
      responseError: jest.fn((msg, data, status) => ({
        msg,
        data,
        status,
        statusText: "Error",
        ok: false,
      })),
    };

    jest.unstable_mockModule("mongoose", () => ({
      default: {
        Types: {
          ObjectId: {
            isValid: jest.fn((id) => id && id.length === 24),
          },
        },
      },
    }));
    jest.unstable_mockModule("@/models/modules/boards/Post", () => ({
      default: mockPost,
    }));
    jest.unstable_mockModule("@/models/modules/boards/Board", () => ({
      default: mockBoard,
    }));
    jest.unstable_mockModule(
      "@/libs/modules/boards/analytics",
      () => mockAnalytics,
    );
    jest.unstable_mockModule("@/libs/utils.server", () => mockUtils);
    jest.unstable_mockModule("bad-words", () => ({
      Filter: jest.fn().mockImplementation(() => ({ clean: (s) => s })),
    }));
    jest.unstable_mockModule("@/libs/apiHandler", () => ({
      withApiHandler: (handler) => async (req, ctx) => {
        req.nextUrl = new URL(req.url || "http://localhost");
        return handler(req, {
          session: { user: { id: "user_123" } },
          user: { _id: "user_123" },
          ...ctx,
        });
      },
    }));
    jest.unstable_mockModule("@/libs/defaults", () => ({
      defaultSetting: {
        forms: {
          Post: {
            backend: {
              responses: {
                titleRequired: { message: "Title required", status: 400 },
                descriptionRequired: { message: "Desc required", status: 400 },
                boardIdRequired: { message: "Board ID required", status: 400 },
                createSuccesfully: { message: "Created", status: 201 },
                postNotFound: { message: "Not found", status: 404 },
                deleteSuccesfully: { message: "Deleted", status: 200 },
              },
            },
          },
        },
      },
    }));

    const mod =
      await import("../../../../../app/api/modules/boards/post/route");
    POST = mod.POST;
    DELETE = mod.DELETE;
    GET = mod.GET;
  });

  describe("POST", () => {
    it("should successfully create a post", async () => {
      const req = {
        url: "http://localhost/api/post?boardId=b1",
        json: jest
          .fn()
          .mockResolvedValue({ title: "New Post", description: "Body" }),
        headers: { get: jest.fn().mockReturnValue("client_123") },
      };
      mockPost.create.mockResolvedValue({ _id: "p1", title: "New Post" });

      const res = await POST(req);

      expect(mockPost.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: "New Post", boardId: "b1" }),
      );
      expect(mockAnalytics.trackEvent).toHaveBeenCalled();
      expect(res.status).toBe(201);
    });

    it("should return 400 if boardId is missing", async () => {
      const req = { url: "http://localhost/api/post" };
      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });

  describe("GET", () => {
    it("should fetch posts for a board", async () => {
      const req = { url: "http://localhost/api/post?boardId=b1" };
      const res = await GET(req);
      expect(res.data.posts).toHaveLength(1);
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE", () => {
    it("should delete post if user is board owner", async () => {
      const req = { url: "http://localhost/api/post?postId=p1" };
      mockPost.findById.mockResolvedValue({ _id: "p1", boardId: "b1" });
      mockBoard.findById.mockResolvedValue({ _id: "b1", userId: "user_123" });

      const res = await DELETE(req);
      expect(mockPost.deleteOne).toHaveBeenCalledWith({ _id: "p1" });
      expect(res.status).toBe(200);
    });

    it("should return 401 if not board owner", async () => {
      const req = { url: "http://localhost/api/post?postId=p1" };
      mockPost.findById.mockResolvedValue({ _id: "p1", boardId: "b1" });
      mockBoard.findById.mockResolvedValue({ _id: "b1", userId: "other_user" });

      const res = await DELETE(req);
      expect(res.status).toBe(401);
    });
  });
});
