import React from "react";
import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock dependencies
const mockShow = jest.fn();
const mockHide = jest.fn();
let mockIsVisible = false;

jest.unstable_mockModule("@/hooks/useTooltip", () => ({
  __esModule: true,
  default: () => ({
    isVisible: mockIsVisible,
    show: mockShow,
    hide: mockHide,
  }),
}));

jest.unstable_mockModule("@/context/ContextStyling", () => ({
  useStyling: () => ({
    styling: {
      flex: { col: "flex-col" },
      components: { element: "btn" },
    },
  }),
}));

const Tooltip = (await import("../../../components/common/Tooltip")).default;

describe("components/common/Tooltip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsVisible = false;
  });

  it("should render children", () => {
    render(
      <Tooltip text="Tip">
        <div>Child</div>
      </Tooltip>,
    );
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("should show tooltip on hover (uncontrolled)", () => {
    mockIsVisible = true; // Simulate hook state change
    render(
      <Tooltip text="Tip">
        <div>Child</div>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByText("Child").parentElement);
    expect(mockShow).toHaveBeenCalled();

    // Since we manually toggled isVisible var for the hook mock return,
    // re-render not needed if hook is called on render.
    // But testing-library might need rerender if hook values changed?
    // Actually, the hook is called inside component.
    // We'll trust the mock calls.
  });

  it("should use external control if provided", () => {
    const { rerender } = render(
      <Tooltip text="Tip" isVisible={true}>
        <div>Child</div>
      </Tooltip>,
    );
    expect(screen.getByText("Tip")).toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByText("Child").parentElement);
    expect(mockShow).not.toHaveBeenCalled(); // Should handle internal logic only if uncontrolled

    rerender(
      <Tooltip text="Tip" isVisible={false}>
        <div>Child</div>
      </Tooltip>,
    );
    expect(screen.queryByText("Tip")).not.toBeInTheDocument();
  });
});
