import { ranges, useAnalyticsRange } from "@/hooks/useAnalyticsRange";
import { act, renderHook } from "@testing-library/react";

describe("hooks/useAnalyticsRange", () => {
  it("should initialize with default range if not provided", () => {
    // Default in code is "30d"
    const { result } = renderHook(() => useAnalyticsRange());
    expect(result.current.range).toBe("30d");
  });

  it("should initialize with provided range", () => {
    const { result } = renderHook(() => useAnalyticsRange("7d"));
    expect(result.current.range).toBe("7d");
  });

  it("should update range", () => {
    const { result } = renderHook(() => useAnalyticsRange());

    act(() => {
      result.current.setRange("today");
    });

    expect(result.current.range).toBe("today");
    expect(result.current.startLabel).toBe("Today");
  });

  it("should return correct labels for ranges", () => {
    // We can test a few cases
    const { result } = renderHook(() => useAnalyticsRange("yesterday"));
    expect(result.current.startLabel).toBe("Yesterday");
    expect(result.current.endLabel).toBe("End of day");
  });

  it("should expose ranges constant", () => {
    const { result } = renderHook(() => useAnalyticsRange());
    expect(result.current.ranges).toEqual(ranges);
    expect(ranges.length).toBeGreaterThan(0);
  });
});
