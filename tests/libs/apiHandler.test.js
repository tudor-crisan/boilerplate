/** @jest-environment node */
import { jest } from "@jest/globals";

describe("libs/apiHandler.js", () => {
  let withApiHandler;
  let authMock;
  let connectMongoMock;
  let checkReqRateLimitMock;
  let userFindByIdMock;
  let responseErrorMock;
  let responseMockFuncMock;
  let isResponseMockMock;

  const mockSettings = {
    forms: {
      general: {
        backend: {
          responses: {
            notAuthorized: { message: "Not Auth", status: 401 },
            sessionLost: { message: "Session Lost", status: 401 },
            serverError: { message: "Server Error", status: 500 },
            noAccess: { message: "No Access", status: 403 },
          },
        },
      },
      testForm: {
        mockConfig: { isEnabled: true },
      },
    },
  };

  beforeAll(async () => {
    // Mocks
    authMock = jest.fn();
    connectMongoMock = jest.fn();
    checkReqRateLimitMock = jest.fn();
    userFindByIdMock = jest.fn();
    responseErrorMock = jest.fn((msg, err, status) => ({ error: msg, status }));
    responseMockFuncMock = jest.fn(() => ({ mock: true }));
    isResponseMockMock = jest.fn(() => false);

    jest.unstable_mockModule("@/modules/auth/libs/auth", () => ({ auth: authMock }));
    jest.unstable_mockModule("@/libs/defaults", () => ({
      defaultSetting: mockSettings,
    }));
    jest.unstable_mockModule("@/libs/mongoose", () => ({
      default: connectMongoMock,
    }));
    jest.unstable_mockModule("@/libs/rateLimit", () => ({
      checkReqRateLimit: checkReqRateLimitMock,
    }));
    jest.unstable_mockModule("@/models/User", () => ({
      default: { findById: userFindByIdMock },
    }));
    jest.unstable_mockModule("@/libs/utils.server", () => ({
      isResponseMock: isResponseMockMock,
      responseError: responseErrorMock,
      responseMock: responseMockFuncMock,
    }));

    withApiHandler = (await import("../../libs/apiHandler")).withApiHandler;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should block request if rate limit exceeded", async () => {
    checkReqRateLimitMock.mockResolvedValueOnce({ error: "Rate Limit" });
    const handler = withApiHandler(() => {}, { rateLimitKey: "test" });
    const res = await handler({});
    expect(res).toEqual({ error: "Rate Limit" });
    expect(checkReqRateLimitMock).toHaveBeenCalled();
  });

  it("should block request if unauthorized (needAuth=true)", async () => {
    authMock.mockResolvedValue(null);
    const handler = withApiHandler(() => {}, { needAuth: true });
    const res = await handler({});
    expect(res).toEqual({ error: "Not Auth", status: 401 });
  });

  it("should allow request if authorized", async () => {
    authMock.mockResolvedValue({ user: { id: "123" } });
    userFindByIdMock.mockResolvedValue({ id: "123", hasAccess: true });

    const actualHandler = jest.fn().mockResolvedValue("success");
    const handler = withApiHandler(actualHandler, { needAuth: true });

    const res = await handler({});
    expect(res).toBe("success");
    expect(actualHandler).toHaveBeenCalled();
    expect(connectMongoMock).toHaveBeenCalled();
  });

  it("should block if user not found checks", async () => {
    authMock.mockResolvedValue({ user: { id: "123" } });
    userFindByIdMock.mockResolvedValue(null); // User deleted?

    const handler = withApiHandler(() => {}, { needAuth: true });
    const res = await handler({});
    expect(res).toEqual({ error: "Session Lost", status: 401 });
  });

  it("should block if user has no access (needAccess=true)", async () => {
    authMock.mockResolvedValue({ user: { id: "123" } });
    userFindByIdMock.mockResolvedValue({ id: "123", hasAccess: false });

    const handler = withApiHandler(() => {}, { needAccess: true });
    const res = await handler({});
    expect(res).toEqual({ error: "No Access", status: 403 });
  });

  it("should allow if user has no access but needAccess=false", async () => {
    authMock.mockResolvedValue({ user: { id: "123" } });
    userFindByIdMock.mockResolvedValue({ id: "123", hasAccess: false });

    const actualHandler = jest.fn().mockResolvedValue("success");
    const handler = withApiHandler(actualHandler, { needAccess: false });

    const res = await handler({});
    expect(res).toBe("success");
  });

  it("should return mock response if enabled", async () => {
    isResponseMockMock.mockReturnValue(true);
    const handler = withApiHandler(() => {}, { type: "testForm" });
    const res = await handler({});
    expect(res).toEqual({ mock: true });
    expect(responseMockFuncMock).toHaveBeenCalledWith("testForm");
  });

  it("should catch errors and return server error", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    authMock.mockRejectedValue(new Error("Database boom"));
    const handler = withApiHandler(() => {});
    const res = await handler({});
    expect(res).toEqual({ error: "Server Error", status: 500 });
    consoleSpy.mockRestore();
  });
});
