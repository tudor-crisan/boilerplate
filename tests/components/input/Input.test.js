import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

describe("components/input/Input", () => {
  let InputComponent;
  let useStylingMock;

  beforeAll(async () => {
    useStylingMock = jest.fn(() => ({
      styling: {
        components: { input: "input-bordered" },
        general: { element: "text-base" },
      },
    }));

    jest.unstable_mockModule("@/context/ContextStyling", () => ({
      useStyling: useStylingMock,
    }));

    InputComponent = (await import("@/components/input/Input")).default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render input", () => {
    render(<InputComponent />);
    expect(screen.getByRole("textbox")).toBeTruthy();
  });

  it("should render with value", () => {
    render(<InputComponent value="test value" readOnly />);
    const input = screen.getByRole("textbox");
    expect(input.value).toBe("test value");
  });

  it("should call onChange when value changes", () => {
    const onChange = jest.fn();
    render(<InputComponent onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new value" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("should render with error class", () => {
    render(<InputComponent error="Error message" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("input-error");
  });

  it("should render with placeholder", () => {
    render(<InputComponent placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeTruthy();
  });

  it("should render disabled input", () => {
    render(<InputComponent disabled />);
    const input = screen.getByRole("textbox");
    expect(input.disabled).toBe(true);
  });

  it("should apply custom className", () => {
    render(<InputComponent className="custom-class" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("custom-class");
  });

  it("should render different input types", () => {
    const { rerender } = render(<InputComponent type="email" />);
    expect(screen.getByRole("textbox").type).toBe("email");

    rerender(<InputComponent type="password" />);
    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toBeTruthy();
  });

  it("should render with maxLength", () => {
    render(<InputComponent maxLength={10} />);
    const input = screen.getByRole("textbox");
    expect(input.maxLength).toBe(10);
  });
});
