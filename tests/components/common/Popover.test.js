import React from "react";
import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mocks
jest.unstable_mockModule("@/modules/general/components/svg/SvgChevronRight", () => ({
  default: ({ className }) => (
    <span data-testid="chevron" className={className} />
  ),
}));

const Popover = (await import("../../../modules/general/components/common/Popover")).default;

describe("components/common/Popover", () => {
  const items = [
    { label: "Item 1", href: "/1" },
    { label: "Item 2", href: "/2" },
  ];
  const defaultProps = {
    label: "Click Me",
    items,
    onItemClick: jest.fn(),
  };

  it("should render label and toggle visibility", () => {
    render(<Popover {...defaultProps} />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Click Me"));
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Click Me"));
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
  });

  it("should call onItemClick when an item is clicked", () => {
    render(<Popover {...defaultProps} />);
    fireEvent.click(screen.getByText("Click Me"));
    fireEvent.click(screen.getByText("Item 1"));
    expect(defaultProps.onItemClick).toHaveBeenCalled();
  });
});
