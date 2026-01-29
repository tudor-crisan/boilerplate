import React from "react";
import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock fonts
jest.unstable_mockModule("@/modules/general/lists/fonts", () => ({
  fontMap: {
    Inter: "Inter, sans-serif",
    Roboto: "Roboto, sans-serif",
  },
}));

const ThemeWrapper = (await import("../../../modules/general/components/common/ThemeWrapper"))
  .default;

describe("components/common/ThemeWrapper", () => {
  it("should render children", () => {
    render(
      <ThemeWrapper>
        <div data-testid="content">Content</div>
      </ThemeWrapper>,
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("should apply data-theme attribute", () => {
    const { container } = render(<ThemeWrapper theme="Dark" />);
    expect(container.firstChild).toHaveAttribute("data-theme", "dark");
  });

  it("should apply custom font from fontMap", () => {
    const { container } = render(<ThemeWrapper font="Inter" />);
    expect(container.firstChild).toHaveStyle("font-family: Inter, sans-serif");
  });

  it("should apply custom className", () => {
    const { container } = render(<ThemeWrapper className="my-wrapper" />);
    expect(container.firstChild).toHaveClass("my-wrapper");
  });
});
