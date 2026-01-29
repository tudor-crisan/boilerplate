import { jest } from "@jest/globals";

describe("api/modules/boards/vote", () => {
  let POST, DELETE;
  let mockPost, mockAnalytics, mockUtils;

  beforeEach(async () => {
    jest.resetModules();

    mockPost = {
      findById: jest.fn(),
    };
    mockAnalytics = {
      trackEvent: jest.fn().mockResolvedValue({}),
      createNotification: jest.fn().mockResolvedValue({}),
    };
    mockUtils = {
      responseSuccess: jest.fn((msg, data, status) => ({ msg, data, status })),
      responseError: jest.fn((msg, data, status) => ({ msg, data, status })),
    };

    jest.unstable_mockModule("@/modules/boards/models/Post", () => ({
      default: mockPost,
    }));
    jest.unstable_mockModule(
      "@/modules/boards/libs/analytics",
      () => mockAnalytics,
    );
    jest.unstable_mockModule("@/modules/general/libs/utils.server", () => mockUtils);
    jest.unstable_mockModule("@/modules/general/libs/apiHandler", () => ({
      withApiHandler: (handler) => async (req) => {
        req.nextUrl = new URL(req.url || "http://localhost");
        return handler(req, {});
      },
    }));
    jest.unstable_mockModule("@/modules/general/libs/defaults", () => ({
      defaultSetting: {
        forms: {
          general: {
            backend: {
              responses: { serverError: { message: "Error", status: 500 } },
            },
          },
          Vote: {
            backend: {
              responses: {
                voteRecorded: { message: "Voted", status: 200 },
                voteRemoved: { message: "Removed", status: 200 },
                postNotFound: { message: "Not found", status: 404 },
                postIdRequired: { message: "ID required", status: 400 },
              },
            },
          },
        },
      },
    }));

    const mod =
      await import("../../../../../app/api/modules/boards/vote/route");
    POST = mod.POST;
    DELETE = mod.DELETE;

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("POST should increment votes", async () => {
    const req = {
      url: "http://localhost/api/vote?postId=p1",
      headers: { get: jest.fn().mockReturnValue("client_1") },
    };
    const mockPostInstance = {
      _id: "p1",
      votesCounter: 0,
      save: jest.fn(),
      boardId: "b1",
      title: "Test",
    };
    mockPost.findById.mockResolvedValue(mockPostInstance);

    const res = await POST(req);

    expect(mockPostInstance.votesCounter).toBe(1);
    expect(mockPostInstance.save).toHaveBeenCalled();
    expect(mockAnalytics.trackEvent).toHaveBeenCalledWith("b1", "VOTE");
    expect(res.status).toBe(200);
  });

  it("DELETE should decrement votes", async () => {
    const req = {
      url: "http://localhost/api/vote?postId=p1",
      headers: { get: jest.fn().mockReturnValue("client_1") },
    };
    const mockPostInstance = {
      _id: "p1",
      votesCounter: 10,
      save: jest.fn(),
      boardId: "b1",
      title: "Test",
    };
    mockPost.findById.mockResolvedValue(mockPostInstance);

    const res = await DELETE(req);

    expect(mockPostInstance.votesCounter).toBe(9);
    expect(res.status).toBe(200);
  });

  it("should return 404 if post not found", async () => {
    const req = { url: "http://localhost/api/vote?postId=missing" };
    mockPost.findById.mockResolvedValue(null);
    const res = await POST(req);
    expect(res.status).toBe(404);
  });
});
