import { jest } from "@jest/globals";

describe("libs/api", () => {
  let apiModule;
  let mockAxiosCreate;
  let mockAxiosInstance;
  let mockGetClientId;

  beforeEach(async () => {
    jest.resetModules();

    // Mock Axios
    mockAxiosInstance = {
      interceptors: {
        request: {
          use: jest.fn(),
        },
      },
    };
    mockAxiosCreate = jest.fn(() => mockAxiosInstance);
    jest.unstable_mockModule("axios", () => ({
      default: {
        create: mockAxiosCreate,
      },
    }));

    // Mock utils
    mockGetClientId = jest.fn();
    jest.unstable_mockModule("@/libs/utils.client", () => ({
      getClientId: mockGetClientId,
    }));

    // Mock defaults via real import or simple mock if needed.
    // We can rely on the real one if it has no side effects, or mock it to be safe.
    // The current file imports `defaultSetting` from `@/libs/defaults`.

    // Import module
    apiModule = await import("../../libs/api");
  });

  describe("clientApi", () => {
    it("should create axios instance", () => {
      expect(mockAxiosCreate).toHaveBeenCalled();
      expect(apiModule.clientApi).toBe(mockAxiosInstance);
    });

    it("should set x-client-id header in interceptor", () => {
      const useInterceptor = mockAxiosInstance.interceptors.request.use;
      expect(useInterceptor).toHaveBeenCalled();

      const interceptorFn = useInterceptor.mock.calls[0][0];

      const config = { headers: {} };
      mockGetClientId.mockReturnValue("test-client-id");

      const result = interceptorFn(config);

      expect(result.headers["x-client-id"]).toBe("test-client-id");
    });
  });

  describe("setDataError", () => {
    it("should handle network error", () => {
      const callback = jest.fn();
      const response = { code: "ERR_NETWORK" };

      apiModule.setDataError(response, callback);

      expect(callback).toHaveBeenCalledWith(
        expect.stringContaining("connection"), // Loose match for "No internet connection"
        {},
        408,
      );
    });

    it("should handle error status codes", () => {
      const callback = jest.fn();
      const response = { status: 400, data: { error: "Bad Request" } };

      const handled = apiModule.setDataError(response, callback);

      expect(handled).toBe(true);
      expect(callback).toHaveBeenCalledWith("Bad Request", {}, 400);
    });

    it("should ignore success status codes", () => {
      const callback = jest.fn();
      const response = { status: 200 };
      const handled = apiModule.setDataError(response, callback);
      expect(handled).toBe(false);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("setDataSuccess", () => {
    it("should handle success status code", () => {
      const callback = jest.fn();
      const response = {
        status: 200,
        data: { message: "OK", data: { id: 1 } },
      };

      const handled = apiModule.setDataSuccess(response, callback);

      expect(handled).toBe(true);
      expect(callback).toHaveBeenCalledWith("OK", { id: 1 }, 200);
    });

    it("should ignore non-200 status", () => {
      const callback = jest.fn();
      const response = { status: 400 };
      const handled = apiModule.setDataSuccess(response, callback);
      expect(handled).toBe(false);
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
