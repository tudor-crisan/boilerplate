import { jest } from "@jest/globals";

// Polyfill for next/server
if (typeof global.Request === "undefined") {
  global.Request = class {};
  global.Response = class {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
    }
    static json(data, init) {
      return { ...data, ...init, status: init?.status || 200 };
    }
  };
}

describe("billing portal & weekly digest", () => {
  let portalPOST, digestGET;
  let mockUser, mockStripe, mockBoard, mockBoardAnalytics, mockEmail;

  beforeEach(async () => {
    jest.resetModules();

    mockUser = {
      findById: jest
        .fn()
        .mockResolvedValue({ _id: "user_1", customerId: "cus_123" }),
    };
    mockStripe = {
      billingPortal: {
        sessions: {
          create: jest
            .fn()
            .mockResolvedValue({ url: "https://stripe.com/portal" }),
        },
      },
    };
    mockBoard = {
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([
        {
          _id: "b1",
          name: "B1",
          userId: { _id: "u1", email: "test@test.com", name: "U1" },
        },
      ]),
    };
    mockBoardAnalytics = {
      aggregate: jest
        .fn()
        .mockResolvedValue([{ _id: "b1", views: 10, posts: 1 }]),
    };
    mockEmail = {
      sendEmail: jest.fn().mockResolvedValue({}),
      WeeklyDigestEmail: jest
        .fn()
        .mockResolvedValue({ subject: "Hi", html: "<p>Hi</p>", text: "Hi" }),
    };

    jest.unstable_mockModule("mongoose", () => ({
      default: {
        Types: {
          ObjectId: jest.fn((id) => ({ toString: () => id })),
        },
      },
    }));
    jest.unstable_mockModule("@/modules/general/libs/mongoose", () => ({ default: jest.fn() }));
    jest.unstable_mockModule("@/modules/general/models/User", () => ({ default: mockUser }));
    jest.unstable_mockModule("@/modules/boards/models/Board", () => ({
      default: mockBoard,
    }));
    jest.unstable_mockModule("@/modules/boards/models/BoardAnalytics", () => ({
      default: mockBoardAnalytics,
    }));
    jest.unstable_mockModule("stripe", () => ({
      default: jest.fn().mockImplementation(() => mockStripe),
    }));
    jest.unstable_mockModule("@/modules/general/libs/email", () => mockEmail);
    jest.unstable_mockModule("@/modules/auth/libs/auth", () => ({
      auth: jest.fn().mockResolvedValue({ user: { id: "user_1" } }),
    }));
    jest.unstable_mockModule("@/modules/general/libs/rateLimit", () => ({
      checkReqRateLimit: jest.fn(),
    }));
    jest.unstable_mockModule("next/server", () => ({
      NextResponse: {
        json: jest.fn((data, init) => ({
          ...data,
          ...init,
          status: init?.status || 200,
        })),
      },
    }));
    jest.unstable_mockModule("@/modules/general/libs/utils.server", () => ({
      getBaseUrl: () => "http://localhost",
      isResponseMock: () => false,
      responseMock: (type) => ({ type, mock: true }),
      responseSuccess: (msg, data, status) => ({ msg, data, status }),
      responseError: (msg, data, status) => ({ msg, data, status }),
    }));
    jest.unstable_mockModule("@/modules/general/libs/defaults", () => ({
      defaultSetting: {
        forms: {
          general: {
            backend: {
              responses: {
                notAuthorized: { status: 401 },
                serverError: { status: 500 },
              },
            },
          },
          Billing: {
            backend: { responses: { portalCreated: { status: 200 } } },
          },
        },
        paths: { dashboard: { source: "/dashboard" } },
      },
    }));

    portalPOST = (await import("../app/api/modules/billing/create-portal/route")).POST;
    digestGET = (await import("../app/api/modules/boards/weekly-digest/route"))
      .GET;

    process.env.STRIPE_SECRET_KEY = "sk_test";
    process.env.CRON_SECRET = "cron_secret";
  });

  describe("portal", () => {
    it("should create a stripe portal session", async () => {
      const req = {
        json: jest
          .fn()
          .mockResolvedValue({ returnUrl: "http://localhost/home" }),
      };
      const res = await portalPOST(req);
      expect(mockStripe.billingPortal.sessions.create).toHaveBeenCalledWith({
        customer: "cus_123",
        return_url: "http://localhost/home",
      });
      expect(res.data.url).toBe("https://stripe.com/portal");
    });
  });

  describe("weekly digest", () => {
    it("should send emails to active users", async () => {
      process.env.RESEND_EMAIL_FROM = "no-reply@test.com";
      const req = { headers: { get: () => "Bearer cron_secret" } };
      const res = await digestGET(req);

      expect(mockBoardAnalytics.aggregate).toHaveBeenCalled();
      expect(mockEmail.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "no-reply@test.com",
          email: "test@test.com",
        }),
      );
      expect(res.emailsSent).toBe(1);
    });

    it("should return 401 if cron secret is invalid", async () => {
      const req = { headers: { get: () => "Bearer wrong" } };
      const res = await digestGET(req);
      expect(res.status).toBe(401);
    });
  });
});
