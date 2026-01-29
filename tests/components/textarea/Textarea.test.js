import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

describe("components/textarea/Textarea", () => {
  let Textarea;

  beforeAll(async () => {
    jest.unstable_mockModule("@/modules/general/context/ContextStyling", () => ({
      useStyling: () => ({
        styling: {
          components: { textarea: "textarea" },
          general: { element: "element-class" },
        },
      }),
    }));

    jest.unstable_mockModule("@/modules/general/components/common/CharacterCount", () => ({
      default: ({ currentLength, maxLength }) => (
        <div data-testid="character-count">
          {currentLength}/{maxLength}
        </div>
      ),
    }));

    Textarea = (await import("@/modules/general/components/textarea/Textarea")).default;
  });

  it("should render textarea", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toBeTruthy();
  });

  it("should render with value", () => {
    render(<Textarea value="test value" readOnly />);
    const textarea = screen.getByRole("textbox");
    expect(textarea.value).toBe("test value");
  });

  it("should call onChange when value changes", () => {
    const onChange = jest.fn();
    render(<Textarea onChange={onChange} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "new value" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("should apply error class when error prop is provided", () => {
    const { container } = render(<Textarea error="Error message" />);
    const textarea = container.querySelector("textarea");
    expect(textarea.className).toContain("textarea-error");
  });

  it("should render character count when showCharacterCount and maxLength are provided", () => {
    render(
      <Textarea showCharacterCount maxLength={100} value="test" readOnly />,
    );
    expect(screen.getByTestId("character-count")).toBeTruthy();
    expect(screen.getByText("4/100")).toBeTruthy();
  });

  it("should not render character count when showCharacterCount is false", () => {
    render(
      <Textarea
        showCharacterCount={false}
        maxLength={100}
        value="test"
        readOnly
      />,
    );
    expect(screen.queryByTestId("character-count")).toBeFalsy();
  });

  it("should not render character count when maxLength is not provided", () => {
    render(<Textarea showCharacterCount value="test" readOnly />);
    expect(screen.queryByTestId("character-count")).toBeFalsy();
  });

  it("should apply custom className", () => {
    const { container } = render(<Textarea className="custom-class" />);
    const textarea = container.querySelector("textarea");
    expect(textarea.className).toContain("custom-class");
  });

  it("should render with placeholder", () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeTruthy();
  });

  it("should handle empty value in character count", () => {
    render(<Textarea showCharacterCount maxLength={100} value="" readOnly />);
    expect(screen.getByText("0/100")).toBeTruthy();
  });
});
