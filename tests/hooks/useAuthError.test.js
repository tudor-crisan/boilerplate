import { jest } from "@jest/globals";
import { renderHook } from "@testing-library/react";

describe("hooks/useAuthError", () => {
  let useAuthError;
  let useSearchParamsMock;

  beforeAll(async () => {
    useSearchParamsMock = jest.fn();
    jest.unstable_mockModule("next/navigation", () => ({
      useSearchParams: useSearchParamsMock,
    }));

    const importedModule = await import("../../hooks/useAuthError");
    useAuthError = importedModule.useAuthError;
  });

  it("should return null if no error param", () => {
    useSearchParamsMock.mockReturnValue({ get: () => null });
    const { result } = renderHook(() => useAuthError());
    expect(result.current.message).toBeNull();
  });

  it("should return correct message for known error", () => {
    useSearchParamsMock.mockReturnValue({ get: () => "AccessDenied" });
    const { result } = renderHook(() => useAuthError());
    expect(result.current.message).toContain("Access denied");
    expect(result.current.error).toBe("AccessDenied");
  });

  it("should return default message for unknown error", () => {
    useSearchParamsMock.mockReturnValue({ get: () => "UnknownCode" });
    const { result } = renderHook(() => useAuthError());
    expect(result.current.message).toContain("unexpected");
    expect(result.current.error).toBe("UnknownCode");
  });
});
