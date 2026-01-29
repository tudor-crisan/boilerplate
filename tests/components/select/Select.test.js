import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

describe("components/select/Select", () => {
  let SelectComponent;
  let useStylingMock;

  beforeAll(async () => {
    // Mock useStyling
    useStylingMock = jest.fn(() => ({
      styling: {
        components: { element: "rounded-md" },
        general: { element: "text-base" },
      },
    }));

    jest.unstable_mockModule(
      "@/modules/general/context/ContextStyling",
      () => ({
        useStyling: useStylingMock,
      }),
    );

    jest.unstable_mockModule("@/modules/general/libs/utils.client", () => ({
      cn: (...inputs) => inputs.filter(Boolean).join(" "),
    }));

    SelectComponent = (
      await import("@/modules/general/components/select/Select")
    ).default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render select with options", () => {
    const options = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ];

    render(<SelectComponent options={options} />);
    expect(screen.getByRole("combobox")).toBeTruthy();
    expect(screen.getByText("Option 1")).toBeTruthy();
    expect(screen.getByText("Option 2")).toBeTruthy();
  });

  it("should call onChange when selection changes", () => {
    const onChange = jest.fn();
    const options = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ];

    render(<SelectComponent options={options} onChange={onChange} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "2" } });
    expect(onChange).toHaveBeenCalled();
    const callArg = onChange.mock.calls[0][0];
    expect(callArg.target.value).toBe("2");
  });

  it("should render with default value", () => {
    const options = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ];

    render(<SelectComponent options={options} value="2" readOnly />);
    const select = screen.getByRole("combobox");
    expect(select.value).toBe("2");
  });

  it("should apply custom className", () => {
    const options = [{ value: "1", label: "Option 1" }];
    render(<SelectComponent options={options} className="custom-class" />);
    const select = screen.getByRole("combobox");
    expect(select.className).toContain("custom-class");
  });

  it("should render disabled select", () => {
    const options = [{ value: "1", label: "Option 1" }];
    render(<SelectComponent options={options} disabled />);
    const select = screen.getByRole("combobox");
    expect(select.disabled).toBe(true);
  });

  it("should render with placeholder", () => {
    const options = [{ value: "1", label: "Option 1" }];
    render(<SelectComponent options={options} placeholder="Select..." />);
    expect(screen.getByText("Select...")).toBeTruthy();
  });
});
