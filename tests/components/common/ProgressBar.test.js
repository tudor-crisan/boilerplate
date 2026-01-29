import React from "react";
import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mocks
jest.unstable_mockModule("@/modules/general/context/ContextStyling", () => ({
  useStyling: () => ({
    styling: {
      components: { progressBar: "mock-progress" },
    },
  }),
}));

const ProgressBar = (
  await import("../../../modules/general/components/common/ProgressBar")
).default;

describe("components/common/ProgressBar", () => {
  it("should render progress with value and max", () => {
    render(<ProgressBar value={45} max={100} />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveAttribute("value", "45");
    expect(progress).toHaveAttribute("max", "100");
  });

  it("should apply correct color class", () => {
    render(<ProgressBar value={10} color="secondary" />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveClass("progress-secondary");
  });

  it("should default to progress-primary if no color provided", () => {
    // Explicitly testing null/undefined if possible, though it defaults to 'primary' in props
    render(<ProgressBar value={50} color={null} />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveClass("progress-primary");
  });

  it("should apply custom className", () => {
    render(<ProgressBar value={50} className="custom-progress" />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveClass("custom-progress");
  });
});
