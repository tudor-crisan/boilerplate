import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";

describe("EmptyState", () => {
  let EmptyState;
  let useStylingMock;

  beforeAll(async () => {
    useStylingMock = jest.fn(() => ({
      styling: {
        components: { card: "card-class" },
        general: { box: "box-class" },
        flex: { col_center: "flex-col-center" },
      },
    }));

    jest.unstable_mockModule(
      "@/modules/general/context/ContextStyling",
      () => ({
        useStyling: useStylingMock,
      }),
    );

    // Mock Title and Paragraph
    jest.unstable_mockModule(
      "@/modules/general/components/common/Title",
      () => ({
        default: ({ children }) => <h1>{children}</h1>,
      }),
    );

    jest.unstable_mockModule(
      "@/modules/general/components/common/Paragraph",
      () => ({
        default: ({ children }) => <p>{children}</p>,
      }),
    );

    // Mock Vertical
    jest.unstable_mockModule(
      "@/modules/general/components/common/Vertical",
      () => ({
        default: ({ children }) => <div>{children}</div>,
      }),
    );

    const importedModule =
      await import("../../../modules/general/components/common/EmptyState");
    EmptyState = importedModule.default;
  });

  it("should render title and description", () => {
    render(<EmptyState title="No Items" description="Add something" />);
    expect(screen.getByText("No Items")).toBeInTheDocument();
    expect(screen.getByText("Add something")).toBeInTheDocument();
  });

  it("should render icon if provided", () => {
    render(
      <EmptyState
        title="T"
        description="D"
        icon={<span data-testid="icon">Icon</span>}
      />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
