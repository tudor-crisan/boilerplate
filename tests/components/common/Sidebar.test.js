import Sidebar from "@/components/common/Sidebar";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("components/common/Sidebar", () => {
  it("should render children", () => {
    render(
      <Sidebar>
        <div data-testid="sidebar-content">Content</div>
      </Sidebar>,
    );
    expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<Sidebar className="custom-sidebar" />);
    expect(container.firstChild).toHaveClass("custom-sidebar");
  });

  it("should have sticky and width classes", () => {
    const { container } = render(<Sidebar />);
    expect(container.firstChild).toHaveClass("sm:sticky");
    expect(container.firstChild).toHaveClass("sm:w-92");
  });
});
