import CharacterCount from "@/components/common/CharacterCount";
import { render, screen } from "@testing-library/react";

describe("CharacterCount", () => {
  it("should not render if no maxLength", () => {
    const { container } = render(<CharacterCount currentLength={5} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render correct count", () => {
    render(<CharacterCount currentLength={10} maxLength={100} />);
    expect(screen.getByText("10 / 100")).toBeInTheDocument();
  });

  it("should apply custom class", () => {
    const { container } = render(
      <CharacterCount
        currentLength={5}
        maxLength={10}
        className="custom-class"
      />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
