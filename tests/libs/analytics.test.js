import { jest } from "@jest/globals";

// Polyfill for next/server
if (typeof global.Request === "undefined") {
  global.Request = class {};
  global.Response = class {
    static json(data, init) {
      return { ...data, ...init, status: init?.status || 200 };
    }
  };
}
if (typeof global.URL === "undefined") {
  global.URL = class {
    constructor(url) {
      this.searchParams = new URLSearchParams(url.split("?")[1]);
      this.url = url;
    }
  };
}

describe("boards analytics (API & Lib)", () => {
  let trackEvent, createNotification;
  let boardGET, globalGET, visitPOST;
  let mockBoard, mockBoardAnalytics, mockNotification, mockUtils, mockQuery;
  let mockNextResponse;

  beforeEach(async () => {
    jest.resetModules();

    mockQuery = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([{ _id: "b1", name: "B1" }]),
      then: jest
        .fn()
        .mockImplementation((cb) => cb([{ _id: "b1", name: "B1" }])),
    };

    mockBoard = {
      findOne: jest.fn().mockReturnValue(mockQuery),
      find: jest.fn().mockReturnValue(mockQuery),
      findById: jest.fn().mockReturnValue(mockQuery),
    };
    mockBoardAnalytics = {
      updateOne: jest.fn(),
      find: jest.fn().mockReturnValue(mockQuery),
      aggregate: jest.fn().mockResolvedValue([]),
    };
    mockNotification = {
      create: jest.fn(),
    };
    mockUtils = {
      getAnalyticsDateRange: jest.fn(() => ({
        startDate: new Date(),
        endDate: new Date(),
      })),
      responseSuccess: jest.fn((msg, data, status) => ({ msg, data, status })),
      responseError: jest.fn((msg, data, status) => ({ msg, data, status })),
    };

    mockNextResponse = {
      json: jest.fn((data, init) => ({
        ...data,
        ...init,
        status: init?.status || 200,
      })),
    };

    jest.unstable_mockModule("mongoose", () => ({
      default: {
        Types: {
          ObjectId: jest.fn((id) => ({ toString: () => id })),
        },
      },
    }));
    jest.unstable_mockModule("@/modules/general/libs/mongoose", () => ({
      default: jest.fn(),
    }));
    jest.unstable_mockModule("@/modules/boards/models/Board", () => ({
      default: mockBoard,
    }));
    jest.unstable_mockModule("@/modules/boards/models/BoardAnalytics", () => ({
      default: mockBoardAnalytics,
    }));
    jest.unstable_mockModule("@/modules/boards/models/Notification", () => ({
      default: mockNotification,
    }));
    jest.unstable_mockModule(
      "@/modules/general/libs/utils.server",
      () => mockUtils,
    );
    jest.unstable_mockModule("next/server", () => ({
      NextResponse: mockNextResponse,
    }));
    jest.unstable_mockModule("@/modules/general/libs/apiHandler", () => ({
      withApiHandler: (handler) => async (req, ctx) => {
        req.nextUrl = new URL(req.url || "http://localhost");
        return handler(req, { session: { user: { id: "user_1" } }, ...ctx });
      },
    }));

    const lib = await import("../../modules/boards/libs/analytics");
    trackEvent = lib.trackEvent;
    createNotification = lib.createNotification;

    boardGET = (
      await import("../../app/api/modules/boards/analytics/board/route")
    ).GET;
    globalGET = (
      await import("../../app/api/modules/boards/analytics/global/route")
    ).GET;
    visitPOST = (
      await import("../../app/api/modules/boards/analytics/visit/route")
    ).POST;

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("analytics lib", () => {
    it("trackEvent should call updateOne with upsert", async () => {
      await trackEvent("b1", "VIEW");
      expect(mockBoardAnalytics.updateOne).toHaveBeenCalledWith(
        { boardId: "b1", date: expect.any(Date) },
        { $inc: { views: 1 } },
        { upsert: true },
      );
    });

    it("createNotification should create record for owner", async () => {
      mockQuery.lean.mockResolvedValue({ userId: "user_1", name: "My Board" });
      await createNotification("b1", "POST", { postId: "p1" });
      expect(mockNotification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user_1",
          type: "POST",
        }),
      );
    });
  });

  describe("API routes", () => {
    it("board GET should return stats if owner", async () => {
      const req = { url: "http://localhost/api/board?boardId=b1&range=7d" };
      mockBoard.findOne.mockReturnValue(mockQuery);
      mockQuery.then.mockImplementation((cb) =>
        cb({ _id: "b1", userId: "user_1" }),
      );
      mockBoardAnalytics.find.mockReturnValue(mockQuery);
      mockQuery.sort.mockResolvedValue([{ views: 10 }]);

      const res = await boardGET(req);
      expect(res.stats).toHaveLength(1);
    });

    it("global GET should return timeline and boards", async () => {
      const req = { url: "http://localhost/api/global?range=30d" };
      mockBoard.find.mockReturnValue(mockQuery);
      mockQuery.select.mockReturnThis();
      mockQuery.then.mockImplementation((cb) =>
        cb([{ _id: "b1", name: "B1" }]),
      );
      mockBoardAnalytics.aggregate
        .mockResolvedValueOnce([{ _id: "b1", totalViews: 100 }]) // boards stats
        .mockResolvedValueOnce([{ _id: new Date(), views: 5 }]); // timeline

      const res = await globalGET(req);
      expect(res.data.boards).toHaveLength(1);
      expect(res.data.timeline).toHaveLength(1);
    });

    it("visit POST should call trackEvent", async () => {
      const req = { json: jest.fn().mockResolvedValue({ boardId: "b1" }) };
      const res = await visitPOST(req);
      expect(res.success).toBe(true);
      expect(mockBoardAnalytics.updateOne).toHaveBeenCalled();
    });
  });
});
