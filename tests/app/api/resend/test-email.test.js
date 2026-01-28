import { jest } from "@jest/globals";

describe("api/resend/test-email", () => {
  let POST;
  let mockAuth;
  let mockRateLimit;
  let mockEmail;
  let mockNextResponse;

  beforeEach(async () => {
    jest.resetModules();

    mockAuth = jest
      .fn()
      .mockResolvedValue({ user: { email: "user@example.com" } });
    mockRateLimit = jest.fn().mockResolvedValue(null);
    mockEmail = {
      QuickLinkEmail: jest
        .fn()
        .mockResolvedValue({
          subject: "Quick Link",
          html: "<p>Link</p>",
          text: "Link",
        }),
      WeeklyDigestEmail: jest
        .fn()
        .mockResolvedValue({
          subject: "Weekly Digest",
          html: "<p>Digest</p>",
          text: "Digest",
        }),
      sendEmail: jest.fn().mockResolvedValue({}),
    };
    mockNextResponse = {
      json: jest.fn((data, opts) => ({ ...data, ...opts })),
    };

    jest.unstable_mockModule("@/modules/auth/libs/auth", () => ({ auth: mockAuth }));
    jest.unstable_mockModule("@/libs/rateLimit", () => ({
      checkReqRateLimit: mockRateLimit,
    }));
    jest.unstable_mockModule("@/libs/email", () => mockEmail);
    jest.unstable_mockModule("next/server", () => ({
      NextResponse: mockNextResponse,
    }));
    jest.unstable_mockModule("@/libs/defaults", () => ({
      defaultSetting: { business: { support_email: "support@example.com" } },
    }));

    const mod = await import("../../../../app/api/resend/test-email/route");
    POST = mod.POST;

    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 401 if no session", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST({});
    expect(res.status).toBe(401);
  });

  it("should return rate limit error if limited", async () => {
    mockRateLimit.mockResolvedValue({ status: 429 });
    const res = await POST({});
    expect(res.status).toBe(429);
  });

  it("should send Quick Link test email", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        template: "Quick Link",
        data: { host: "test.com", url: "/test" },
        styling: {},
      }),
    };

    const res = await POST(req);

    expect(mockEmail.QuickLinkEmail).toHaveBeenCalledWith(
      expect.objectContaining({ isTest: true }),
    );
    expect(mockEmail.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: "Quick Link",
      }),
    );
    expect(res.success).toBe(true);
  });

  it("should send Weekly Digest test email", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        template: "Weekly Digest",
        data: { baseUrl: "test.com", userName: "User", boards: [] },
        styling: {},
      }),
    };

    await POST(req);

    expect(mockEmail.WeeklyDigestEmail).toHaveBeenCalledWith(
      expect.objectContaining({ isTest: true }),
    );
    expect(mockEmail.sendEmail).toHaveBeenCalled();
  });

  it("should return 404 for unknown template", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ template: "Unknown" }),
    };

    const res = await POST(req);
    expect(res.status).toBe(404);
  });
});
