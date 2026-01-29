import useTooltip from "@/modules/general/hooks/useTooltip";
import { act, renderHook } from "@testing-library/react";

describe("hooks/useTooltip", () => {
  it("should initialize hidden", () => {
    const { result } = renderHook(() => useTooltip());
    expect(result.current.isVisible).toBe(false);
  });

  it("should show tooltip", () => {
    const { result } = renderHook(() => useTooltip());

    act(() => {
      result.current.show();
    });

    expect(result.current.isVisible).toBe(true);
  });

  it("should hide tooltip", () => {
    const { result } = renderHook(() => useTooltip());

    act(() => {
      result.current.show();
    });
    act(() => {
      result.current.hide();
    });

    expect(result.current.isVisible).toBe(false);
  });
});
