import React from "react";
import { render, screen } from "@testing-library/react";
import VideoSlide from "../VideoSlide";
import { StylingProviderMock } from "./testUtils";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe("VideoSlide Component", () => {
  const mockSlide = {
    id: "1",
    title: "Test Title",
    subtitle: "Test Subtitle",
    bg: "bg-blue-500",
    textColor: "text-white",
    type: "feature",
  };

  const renderWithProvider = (ui) => {
    return render(<StylingProviderMock>{ui}</StylingProviderMock>);
  };

  it("should render feature slide by default", () => {
    renderWithProvider(<VideoSlide slide={mockSlide} isVertical={false} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
  });

  it("should render quote slide correctly", () => {
    const quoteSlide = { ...mockSlide, type: "quote" };
    renderWithProvider(<VideoSlide slide={quoteSlide} isVertical={false} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("— Test Subtitle")).toBeInTheDocument();
    expect(screen.getByText("“")).toBeInTheDocument();
  });

  it("should render image-only slide correctly", () => {
    const imageSlide = { ...mockSlide, type: "image-only", image: "test.jpg" };
    renderWithProvider(<VideoSlide slide={imageSlide} isVertical={false} />);
    const img = screen.getByAltText("Full Image");
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/assets/video/loyalboards/test.jpg");
  });

  it("should render split slide correctly", () => {
    const splitSlide = { ...mockSlide, type: "split", image: "test.jpg" };
    renderWithProvider(<VideoSlide slide={splitSlide} isVertical={false} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByAltText("Split Image")).toBeInTheDocument();
  });
});
