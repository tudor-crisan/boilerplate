import { jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("Button", () => {
  let Button;
  let useStylingMock;

  beforeAll(async () => {
    useStylingMock = jest.fn(() => ({
      styling: {
        components: { element: "btn-class" },
        general: { element: "rounded-md" },
      },
    }));

    jest.unstable_mockModule("@/modules/general/context/ContextStyling", () => ({
      useStyling: useStylingMock,
    }));

    jest.unstable_mockModule("next/link", () => ({
      default: ({ children, href, onClick, ...props }) => (
        <a href={href} onClick={onClick} {...props}>
          {children}
        </a>
      ),
    }));

    jest.unstable_mockModule("@/modules/general/components/icon/IconLoading", () => ({
      default: () => <span data-testid="loading-icon">Loading...</span>,
    }));

    // Importing libs/utils.client for cn is needed or we mock it.
    // If we don't mock it, we rely on real cn implementation which is fine.

    const importedModule = await import("../../../modules/general/components/button/Button");
    Button = importedModule.default;
  });

  it("should render button with children", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveClass("btn", "btn-primary");
  });

  it("should disable button when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should show loading icon when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByTestId("loading-icon")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should handle onClick", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalled();
  });

  it("should auto-load on async onClick", async () => {
    // Mock a promise that resolves after a tick
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    const onClick = jest.fn(() => promise);

    render(<Button onClick={onClick}>Async</Button>);

    fireEvent.click(screen.getByText("Async"));

    expect(await screen.findByTestId("loading-icon")).toBeInTheDocument();

    resolvePromise();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-icon")).not.toBeInTheDocument();
    });
  });

  it("should render as link when href is provided", () => {
    render(<Button href="/link">Link</Button>);
    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toHaveAttribute("href", "/link");
  });

  it("should render as disabled button (not link) even if href provided if disabled=true", () => {
    render(
      <Button href="/link" disabled>
        Disabled Link
      </Button>,
    );
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
