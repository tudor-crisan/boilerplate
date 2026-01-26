import { act } from "react";
import { renderHook } from "@testing-library/react";

describe("hooks/useAnalyticsRange", () => {
  let useAnalyticsRange, ranges;

  beforeAll(async () => {
    const analyticsModule = await import("@/hooks/useAnalyticsRange");
    useAnalyticsRange = analyticsModule.useAnalyticsRange;
    ranges = analyticsModule.ranges;
  });

  it("should initialize with default range", () => {
    const { result } = renderHook(() => useAnalyticsRange());
    expect(result.current.range).toBe("30d");
    expect(result.current.startLabel).toBe("30 days ago");
    expect(result.current.endLabel).toBe("Today");
  });

  it("should initialize with custom range", () => {
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
    expect(result.current.endLabel).toBe("Now");
  });

  it("should return correct labels for all ranges", () => {
    const testCases = [
      { range: "today", start: "Today", end: "Now" },
      { range: "yesterday", start: "Yesterday", end: "End of day" },
      { range: "7d", start: "7 days ago", end: "Today" },
      { range: "30d", start: "30 days ago", end: "Today" },
      { range: "3m", start: "3 months ago", end: "Today" },
      { range: "thisYear", start: "Jan 1", end: "Today" },
      { range: "lastYear", start: "Jan 1", end: "Dec 31" },
      { range: "unknown", start: "Start", end: "End" },
    ];

    testCases.forEach(({ range, start, end }) => {
      const { result } = renderHook(() => useAnalyticsRange(range));
      expect(result.current.startLabel).toBe(start);
      expect(result.current.endLabel).toBe(end);
    });
  });

  it("should export ranges array", () => {
    expect(ranges).toBeDefined();
    expect(ranges.length).toBeGreaterThan(0);
    expect(ranges[0]).toHaveProperty("label");
    expect(ranges[0]).toHaveProperty("value");
  });
});
