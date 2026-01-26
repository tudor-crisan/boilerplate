import { useError } from "@/hooks/useError";
import { act, renderHook } from "@testing-library/react";

describe("hooks/useError", () => {
  it("should initialize with default null", () => {
    const { result } = renderHook(() => useError());
    expect(result.current.error).toBeNull();
  });

  it("should initialize with initial message", () => {
    const { result } = renderHook(() => useError("Init"));
    expect(result.current.error).toBe("Init");
  });

  it("should update error", () => {
    const { result } = renderHook(() => useError());

    act(() => {
      result.current.setError("New Error");
    });

    expect(result.current.error).toBe("New Error");
  });

  it("should clear error", () => {
    const { result } = renderHook(() => useError("Something"));

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it("should update when initialMessage changes", () => {
    const { result, rerender } = renderHook(({ msg }) => useError(msg), {
      initialProps: { msg: "First" },
    });

    expect(result.current.error).toBe("First");

    rerender({ msg: "Second" });
    expect(result.current.error).toBe("Second");
  });
});
