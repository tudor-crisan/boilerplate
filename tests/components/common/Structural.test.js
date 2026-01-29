import React from "react";
import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Standard Stylings Mock
jest.unstable_mockModule("@/modules/general/context/ContextStyling", () => ({
  useStyling: () => ({
    styling: {
      flex: { center: "flex-center" },
      components: { progressBar: "mock-progress" },
    },
  }),
}));

const Divider = (await import("../../../modules/general/components/common/Divider")).default;
const Vertical = (await import("../../../modules/general/components/common/Vertical")).default;
const Flex = (await import("../../../modules/general/components/common/Flex")).default;
const Grid = (await import("../../../modules/general/components/common/Grid")).default;
const Columns = (await import("../../../modules/general/components/common/Columns")).default;
const Paragraph = (await import("../../../modules/general/components/common/Paragraph"))
  .default;
const Title = (await import("../../../modules/general/components/common/Title")).default;
const TextSmall = (await import("../../../modules/general/components/common/TextSmall"))
  .default;
const Loading = (await import("../../../modules/general/components/common/Loading")).default;
const ErrorComp = (await import("../../../modules/general/components/common/Error")).default;

describe("components/common structural components", () => {
  it("Divider should render", () => {
    const { container } = render(<Divider className="my-divider" />);
    expect(container.firstChild).toHaveClass("my-divider");
  });

  it("Vertical should render children", () => {
    render(
      <Vertical>
        <div data-testid="child">Child</div>
      </Vertical>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("Flex should render with custom gap via className", () => {
    const { container } = render(<Flex className="gap-6" />);
    expect(container.firstChild).toHaveClass("gap-6");
  });

  it("Grid should render with custom cols via className", () => {
    const { container } = render(<Grid className="grid-cols-3" />);
    expect(container.firstChild).toHaveClass("grid-cols-3");
  });

  it("Columns should render children", () => {
    render(
      <Columns>
        <div data-testid="c">Col</div>
      </Columns>,
    );
    expect(screen.getByTestId("c")).toBeInTheDocument();
  });

  it("Paragraph should render text", () => {
    render(<Paragraph>Hello</Paragraph>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("Title should render with tag", () => {
    render(<Title tag="h2">Header</Title>);
    const header = screen.getByText("Header");
    expect(header.tagName).toBe("H2");
  });

  it("TextSmall should render", () => {
    render(<TextSmall>Small</TextSmall>);
    expect(screen.getByText("Small")).toBeInTheDocument();
  });

  it("Loading should show spinner", () => {
    const { container } = render(<Loading />);
    expect(container.querySelector(".loading-spinner")).toBeInTheDocument();
  });

  it("Error should show message", () => {
    render(<ErrorComp message="Something failed" />);
    expect(screen.getByText("Something failed")).toBeInTheDocument();
  });
});
