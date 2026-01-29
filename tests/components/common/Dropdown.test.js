import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";

describe("Dropdown", () => {
  let Dropdown;
  let useStylingMock;

  beforeAll(async () => {
    useStylingMock = jest.fn(() => ({
      styling: {
        components: { element: "btn-class", dropdown: "dropdown-class" },
      },
    }));

    jest.unstable_mockModule("@/modules/general/context/ContextStyling", () => ({
      useStyling: useStylingMock,
    }));

    jest.unstable_mockModule("next/link", () => ({
      default: ({ children, href }) => <a href={href}>{children}</a>,
    }));

    const importedModule = await import("../../../modules/general/components/common/Dropdown");
    Dropdown = importedModule.default;
  });

  const mockItems = [
    { label: "Link 1", href: "/link1" },
    { label: "Link 2", href: "/link2" },
  ];

  it("should render label", () => {
    render(<Dropdown label="Menu" items={mockItems} />);
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("should render items", () => {
    render(<Dropdown label="Menu" items={mockItems} />);
    expect(screen.getByText("Link 1")).toBeInTheDocument();
    expect(screen.getByText("Link 2")).toBeInTheDocument();
    expect(screen.getByText("Link 1").closest("a")).toHaveAttribute(
      "href",
      "/link1",
    );
  });

  it("should render children if provided", () => {
    render(
      <Dropdown label="Custom">
        <div data-testid="custom-content">Custom Content</div>
      </Dropdown>,
    );
    expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    expect(screen.queryByText("Link 1")).toBeNull();
  });
});
