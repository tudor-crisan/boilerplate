import React from "react";
import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mocks
jest.unstable_mockModule("@/context/ContextStyling", () => ({
  useStyling: () => ({
    styling: {
      components: { element: "mock-element" },
      flex: { center: "flex-center" },
    },
  }),
}));

const ProfileImage = (await import("../../../components/common/ProfileImage"))
  .default;

describe("components/common/ProfileImage", () => {
  it("should render image if src is provided", () => {
    render(<ProfileImage src="test.jpg" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "test.jpg");
  });

  it("should render initials if src is missing", () => {
    render(<ProfileImage initials="TC" />);
    expect(screen.getByText("TC")).toBeInTheDocument();
  });

  it("should render fallback '?' if both src and initials are missing", () => {
    render(<ProfileImage />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("should apply correct size classes", () => {
    const { container } = render(<ProfileImage size="xl" />);
    const div = container.firstChild;
    expect(div).toHaveClass("size-24");
    expect(div).toHaveClass("text-3xl");
  });

  it("should apply custom className", () => {
    const { container } = render(<ProfileImage className="my-custom-class" />);
    expect(container.firstChild).toHaveClass("my-custom-class");
  });
});
