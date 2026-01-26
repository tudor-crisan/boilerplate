import { jest } from "@jest/globals";

describe("API: /api/auth/[...nextauth]", () => {
  let POST;
  let handlersMock;
  let checkReqRateLimitMock;

  beforeAll(async () => {
    // Mock handlers from auth
    handlersMock = {
      GET: jest.fn(),
      POST: jest.fn(),
    };
    jest.unstable_mockModule("@/libs/auth", () => ({ handlers: handlersMock }));

    // Mock rate limiting
    checkReqRateLimitMock = jest.fn();
    jest.unstable_mockModule("@/libs/rateLimit", () => ({
      checkReqRateLimit: checkReqRateLimitMock,
    }));

    // Mock NextResponse
    jest.unstable_mockModule("next/server", () => ({
      NextResponse: {
        json: jest.fn((body, init) => ({ body, init, status: init.status })),
      },
    }));

    const importedModule =
      await import("../../../app/api/auth/[...nextauth]/route");
    POST = importedModule.POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should check rate limit for email signin", async () => {
    checkReqRateLimitMock.mockResolvedValueOnce(null); // No limit hit
    const req = { url: "http://localhost/api/auth/signin/email" };

    await POST(req);

    expect(checkReqRateLimitMock).toHaveBeenCalledWith(req, "auth-quick-link");
    expect(handlersMock.POST).toHaveBeenCalledWith(req);
  });

  it("should block request if rate limit exceeded for email signin", async () => {
    checkReqRateLimitMock.mockResolvedValueOnce({ error: "Limit" });
    const req = { url: "http://localhost/api/auth/signin/email" };

    const res = await POST(req);

    expect(res.status).toBe(429);
    expect(handlersMock.POST).not.toHaveBeenCalled();
  });

  it("should check rate limit for google signin", async () => {
    checkReqRateLimitMock.mockResolvedValueOnce(null);
    const req = { url: "http://localhost/api/auth/signin/google" };

    await POST(req);

    expect(checkReqRateLimitMock).toHaveBeenCalledWith(
      req,
      "auth-google-signin",
    );
    expect(handlersMock.POST).toHaveBeenCalled();
  });

  it("should allow normal requests", async () => {
    const req = { url: "http://localhost/api/auth/session" };
    await POST(req);
    expect(handlersMock.POST).toHaveBeenCalled();
    expect(checkReqRateLimitMock).not.toHaveBeenCalled();
  });
});
