import { jest } from "@jest/globals";

describe("api/modules/boards/comment", () => {
  let POST, DELETE, GET;
  let mockComment, mockPost, mockBoard, mockAnalytics, mockUtils;

  beforeEach(async () => {
    jest.resetModules();

    mockComment = {
      create: jest.fn(),
      findById: jest.fn(),
      updateOne: jest.fn(),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      }),
    };
    mockPost = { findById: jest.fn() };
    mockBoard = { findById: jest.fn() };
    mockAnalytics = {
      trackEvent: jest.fn().mockResolvedValue({}),
      createNotification: jest.fn().mockResolvedValue({}),
    };
    mockUtils = {
      responseSuccess: jest.fn((msg, data, status) => ({ msg, data, status })),
      responseError: jest.fn((msg, data, status) => ({ msg, data, status })),
    };

    jest.unstable_mockModule("@/modules/boards/models/Comment", () => ({
      default: mockComment,
    }));
    jest.unstable_mockModule("@/modules/boards/models/Post", () => ({
      default: mockPost,
    }));
    jest.unstable_mockModule("@/modules/boards/models/Board", () => ({
      default: mockBoard,
    }));
    jest.unstable_mockModule(
      "@/modules/boards/libs/analytics",
      () => mockAnalytics,
    );
    jest.unstable_mockModule("@/modules/general/libs/utils.server", () => mockUtils);
    jest.unstable_mockModule("bad-words", () => ({
      Filter: jest.fn().mockImplementation(() => ({ clean: (s) => s })),
    }));
    jest.unstable_mockModule("@/modules/general/libs/apiHandler", () => ({
      withApiHandler: (handler) => async (req) => {
        req.nextUrl = new URL(req.url || "http://localhost");
        return handler(req, { session: { user: { id: "user_123" } } });
      },
    }));
    jest.unstable_mockModule("@/modules/general/libs/defaults", () => ({
      defaultSetting: {
        forms: {
          Comment: {
            backend: {
              responses: {
                textRequired: { message: "Text required", status: 400 },
                postIdRequired: { message: "Post ID required", status: 400 },
                createSuccesfully: { message: "Created", status: 201 },
                commentNotFound: { message: "Not found", status: 404 },
                deleteSuccesfully: { message: "Deleted", status: 200 },
                commentsFetched: { message: "Fetched", status: 200 },
              },
            },
          },
        },
      },
    }));

    const mod =
      await import("../../../../../app/api/modules/boards/comment/route");
    POST = mod.POST;
    DELETE = mod.DELETE;
    GET = mod.GET;
  });

  describe("POST", () => {
    it("should create a comment", async () => {
      const req = {
        json: jest.fn().mockResolvedValue({ postId: "p1", text: "Nice!" }),
      };
      mockPost.findById.mockResolvedValue({
        _id: "p1",
        boardId: "b1",
        title: "Post",
      });
      const mockCommentInstance = {
        _id: "c1",
        text: "Nice!",
        populate: jest.fn().mockReturnThis(),
      };
      mockComment.create.mockResolvedValue(mockCommentInstance);

      const res = await POST(req);

      expect(mockComment.create).toHaveBeenCalledWith(
        expect.objectContaining({ text: "Nice!", postId: "p1" }),
      );
      expect(res.status).toBe(201);
    });
  });

  describe("DELETE", () => {
    it("should soft delete comment", async () => {
      const req = { url: "http://localhost/api/comment?commentId=c1" };
      mockComment.findById.mockResolvedValue({ _id: "c1", userId: "user_123" });

      const res = await DELETE(req);
      expect(mockComment.updateOne).toHaveBeenCalledWith(
        { _id: "c1" },
        { $set: { isDeleted: true } },
      );
      expect(res.status).toBe(200);
    });
  });

  describe("GET", () => {
    it("should fetch comments and populate stuff", async () => {
      const req = { url: "http://localhost/api/comment?postId=p1" };
      const res = await GET(req);
      expect(res.status).toBe(200);
      expect(mockComment.find).toHaveBeenCalledWith(
        expect.objectContaining({ postId: "p1" }),
      );
    });
  });
});
