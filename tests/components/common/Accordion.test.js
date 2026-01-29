import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Accordion", () => {
  let Accordion;
  let useStylingMock;

  beforeAll(async () => {
    useStylingMock = jest.fn(() => ({
      styling: {
        components: { card: "card-class" },
      },
    }));

    jest.unstable_mockModule("@/modules/general/context/ContextStyling", () => ({
      useStyling: useStylingMock,
    }));

    const importedModule = await import("../../../modules/general/components/common/Accordion");
    Accordion = importedModule.default;
  });

  const mockItems = [
    { title: "Item 1", content: "Content 1" },
    { title: "Item 2", content: "Content 2" },
  ];

  it("should render all items", () => {
    render(<Accordion items={mockItems} />);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
  });

  it("should open first item by default", () => {
    render(<Accordion items={mockItems} />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("should toggle open state on click", () => {
    render(<Accordion items={mockItems} allowMultiple={true} />);
    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes[0]).toBeChecked();

    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();

    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
  });

  it("should allow multiple open if allowMultiple=true", () => {
    render(<Accordion items={mockItems} allowMultiple={true} />);
    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[1]);

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it("should allow only one open if allowMultiple=false", () => {
    render(<Accordion items={mockItems} allowMultiple={false} />);
    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[1]);

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();

    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).not.toBeChecked();
  });
});
