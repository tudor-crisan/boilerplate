import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

describe("components/input/InputRange", () => {
  let InputRange;

  beforeAll(async () => {
    jest.unstable_mockModule("@/modules/general/context/ContextStyling", () => ({
      useStyling: () => ({
        styling: { components: { range: "range" } },
      }),
    }));

    jest.unstable_mockModule("@/modules/general/libs/utils.client", () => ({
      cn: (...inputs) => inputs.filter(Boolean).join(" "),
    }));

    InputRange = (await import("@/modules/general/components/input/InputRange")).default;
  });

  it("should render range input", () => {
    render(<InputRange value={50} min={0} max={100} onChange={jest.fn()} />);
    const input = screen.getByRole("slider");
    expect(input).toBeTruthy();
    expect(input.value).toBe("50");
  });

  it("should call onChange when value changes", () => {
    const onChange = jest.fn();
    render(<InputRange value={50} min={0} max={100} onChange={onChange} />);
    const input = screen.getByRole("slider");
    fireEvent.change(input, { target: { value: "75" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("should apply primary color by default", () => {
    const { container } = render(
      <InputRange value={50} min={0} max={100} onChange={jest.fn()} />,
    );
    const input = container.querySelector("input");
    expect(input.className).toContain("range-primary");
  });

  it("should apply secondary color", () => {
    const { container } = render(
      <InputRange
        value={50}
        min={0}
        max={100}
        onChange={jest.fn()}
        color="secondary"
      />,
    );
    const input = container.querySelector("input");
    expect(input.className).toContain("range-secondary");
  });

  it("should apply accent color", () => {
    const { container } = render(
      <InputRange
        value={50}
        min={0}
        max={100}
        onChange={jest.fn()}
        color="accent"
      />,
    );
    const input = container.querySelector("input");
    expect(input.className).toContain("range-accent");
  });

  it("should apply success color", () => {
    const { container } = render(
      <InputRange
        value={50}
        min={0}
        max={100}
        onChange={jest.fn()}
        color="success"
      />,
    );
    const input = container.querySelector("input");
    expect(input.className).toContain("range-success");
  });

  it("should apply warning color", () => {
    const { container } = render(
      <InputRange
        value={50}
        min={0}
        max={100}
        onChange={jest.fn()}
        color="warning"
      />,
    );
    const input = container.querySelector("input");
    expect(input.className).toContain("range-warning");
  });

  it("should apply error color", () => {
    const { container } = render(
      <InputRange
        value={50}
        min={0}
        max={100}
        onChange={jest.fn()}
        color="error"
      />,
    );
    const input = container.querySelector("input");
    expect(input.className).toContain("range-error");
  });

  it("should apply info color", () => {
    const { container } = render(
      <InputRange
        value={50}
        min={0}
        max={100}
        onChange={jest.fn()}
        color="info"
      />,
    );
    const input = container.querySelector("input");
    expect(input.className).toContain("range-info");
  });

  it("should fallback to primary for unknown color", () => {
    const { container } = render(
      <InputRange
        value={50}
        min={0}
        max={100}
        onChange={jest.fn()}
        color="unknown"
      />,
    );
    const input = container.querySelector("input");
    expect(input.className).toContain("range-primary");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <InputRange
        value={50}
        min={0}
        max={100}
        onChange={jest.fn()}
        className="custom-class"
      />,
    );
    const input = container.querySelector("input");
    expect(input.className).toContain("custom-class");
  });

  it("should respect step prop", () => {
    render(
      <InputRange value={50} min={0} max={100} step={5} onChange={jest.fn()} />,
    );
    const input = screen.getByRole("slider");
    expect(input.step).toBe("5");
  });
});
