import { jest } from "@jest/globals";

describe("api/modules/boards/notifications", () => {
  let GET, PUT;
  let mockNotification;

  beforeEach(async () => {
    jest.resetModules();

    mockNotification = {
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ _id: "n1", isRead: false }]),
      }),
      countDocuments: jest.fn().mockResolvedValue(10),
      updateMany: jest.fn().mockResolvedValue({}),
    };

    jest.unstable_mockModule("@/models/modules/boards/Notification", () => ({
      default: mockNotification,
    }));
    jest.unstable_mockModule("@/models/modules/boards/Board", () => ({
      default: {},
    }));
    jest.unstable_mockModule("next/server", () => ({
      NextResponse: {
        json: (data, opts) => ({
          ...data,
          ...opts,
          status: opts?.status || 200,
        }),
      },
    }));
    jest.unstable_mockModule("@/libs/apiHandler", () => ({
      withApiHandler: (handler) => async (req) =>
        handler(req, { session: { user: { id: "user_123" } } }),
    }));

    const mod =
      await import("../../../../../app/api/modules/boards/notifications/route");
    GET = mod.GET;
    PUT = mod.PUT;
  });

  it("GET should return paginated notifications", async () => {
    const req = { url: "http://localhost/api/notifications?page=1&limit=5" };
    const res = await GET(req);

    expect(mockNotification.find).toHaveBeenCalled();
    expect(res.data.notifications).toHaveLength(1);
    expect(res.data.hasMore).toBe(true);
  });

  it("PUT should mark notifications as read", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ notificationIds: ["n1", "n2"] }),
    };
    const res = await PUT(req);

    expect(mockNotification.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ _id: { $in: ["n1", "n2"] } }),
      { $set: { isRead: true } },
    );
    expect(res.data.success).toBe(true);
  });

  it("PUT should return 400 for invalid input", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ notificationIds: "not-an-array" }),
    };
    const res = await PUT(req);
    expect(res.status).toBe(400);
  });
});
