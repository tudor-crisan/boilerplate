import { jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

describe("hooks/useApiRequest", () => {
  let useApiRequest;
  let toastMock;
  let apiMock;

  beforeAll(async () => {
    toastMock = {
      success: jest.fn(),
      error: jest.fn(),
    };
    jest.unstable_mockModule("@/modules/general/libs/toast", () => ({
      toast: toastMock,
    }));

    apiMock = {
      setDataError: jest.fn(),
      setDataSuccess: jest.fn(),
    };
    jest.unstable_mockModule("@/modules/general/libs/api", () => apiMock);

    const importedModule =
      await import("../../modules/general/hooks/useApiRequest");
    useApiRequest = importedModule.default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => useApiRequest());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("");
    expect(result.current.inputErrors).toEqual({});
  });

  it("should handle successful request", async () => {
    const { result } = renderHook(() => useApiRequest());

    const reqFn = jest.fn().mockResolvedValue({ success: true, message: "OK" });
    apiMock.setDataError.mockReturnValue(false);

    apiMock.setDataSuccess.mockImplementation((res, cb) => {
      // Simulate helper logic calling callback
      cb(res.message, res.data);
      return true;
    });

    await act(async () => {
      await result.current.request(reqFn);
    });

    expect(toastMock.success).toHaveBeenCalledWith("OK");
    expect(result.current.loading).toBe(false);
  });

  it("should handle error request handled by api lib", async () => {
    const { result } = renderHook(() => useApiRequest());

    const reqFn = jest.fn().mockResolvedValue({ error: "Fail" });

    // Ensure success is not called
    apiMock.setDataSuccess.mockReturnValue(false);

    apiMock.setDataError.mockImplementation((res, cb) => {
      cb(res.error, {}, 400);
      return true;
    });

    await act(async () => {
      await result.current.request(reqFn);
    });

    expect(toastMock.error).toHaveBeenCalledWith("Fail");
    expect(result.current.loading).toBe(false);
  });

  it("should catch exceptions", async () => {
    const { result } = renderHook(() => useApiRequest());
    const reqFn = jest.fn().mockRejectedValue(new Error("Boom"));

    apiMock.setDataError.mockImplementation((err, cb) => {
      cb(err.message, {}, 500);
      return true;
    });

    await act(async () => {
      await result.current.request(reqFn);
    });

    // Exception flow usually sets error state too, but setDataError handles it.
    // If setDataError calls callback, it sets error, which triggers toast.
    expect(toastMock.error).toHaveBeenCalledWith("Boom");
  });
});
