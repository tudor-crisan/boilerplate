import { jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

// Mock deps
const mockFonts = { Inter: "Inter", Roboto: "Roboto" };
const mockThemes = ["light", "dark", "dracula"];

jest.unstable_mockModule("@/modules/general/lists/fonts", () => ({ fontMap: mockFonts }));
jest.unstable_mockModule("@/modules/general/lists/themes", () => ({ default: mockThemes }));

// Import hook after mocking
const { useStylingRandomizer } =
  await import("../../modules/general/hooks/useStylingRandomizer");

describe("hooks/useStylingRandomizer", () => {
  let setStyling;

  beforeEach(() => {
    setStyling = jest.fn((cb) => {
      // Simulate state update if cb is function
      if (typeof cb === "function") {
        const prev = {
          components: { btn: "rounded-md" },
          pricing: {},
          blog: {},
        };
        return cb(prev);
      }
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("should initialize config", () => {
    const { result } = renderHook(() => useStylingRandomizer({ setStyling }));
    expect(result.current.shuffleConfig).toEqual({
      theme: true,
      font: true,
      styling: true,
      auto: false,
    });
  });

  it("should shuffle manually", () => {
    const { result } = renderHook(() => useStylingRandomizer({ setStyling }));

    act(() => {
      result.current.handleShuffle();
    });

    expect(setStyling).toHaveBeenCalled();
  });

  it("should auto shuffle when enabled", () => {
    const { result } = renderHook(() => useStylingRandomizer({ setStyling }));

    act(() => {
      result.current.setShuffleConfig((prev) => ({ ...prev, auto: true }));
    });

    // Should trigger immediately
    expect(setStyling).toHaveBeenCalledTimes(1);

    // Advance timer
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(setStyling).toHaveBeenCalledTimes(2);
  });

  it("should stop shuffle when disabled", () => {
    const { result } = renderHook(() => useStylingRandomizer({ setStyling }));

    act(() => {
      result.current.setShuffleConfig((prev) => ({ ...prev, auto: true }));
    });
    setStyling.mockClear();

    act(() => {
      result.current.setShuffleConfig((prev) => ({ ...prev, auto: false }));
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(setStyling).not.toHaveBeenCalled();
  });
});
