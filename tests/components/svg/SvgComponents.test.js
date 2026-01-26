import { render } from "@testing-library/react";

describe("components/svg", () => {
  let SvgChevronLeft, SvgChevronRight, SvgClose;

  beforeAll(async () => {
    SvgChevronLeft = (await import("@/components/svg/SvgChevronLeft")).default;
    SvgChevronRight = (await import("@/components/svg/SvgChevronRight"))
      .default;
    SvgClose = (await import("@/components/svg/SvgClose")).default;
  });

  describe("SvgChevronLeft", () => {
    it("should render without crashing", () => {
      const { container } = render(<SvgChevronLeft />);
      expect(container.querySelector("svg")).toBeTruthy();
    });

    it("should apply className", () => {
      const { container } = render(<SvgChevronLeft className="custom-class" />);
      const svg = container.querySelector("svg");
      expect(svg.className.baseVal).toContain("custom-class");
    });
  });

  describe("SvgChevronRight", () => {
    it("should render without crashing", () => {
      const { container } = render(<SvgChevronRight />);
      expect(container.querySelector("svg")).toBeTruthy();
    });

    it("should apply className", () => {
      const { container } = render(
        <SvgChevronRight className="custom-class" />,
      );
      const svg = container.querySelector("svg");
      expect(svg.className.baseVal).toContain("custom-class");
    });
  });

  describe("SvgClose", () => {
    it("should render without crashing", () => {
      const { container } = render(<SvgClose />);
      expect(container.querySelector("svg")).toBeTruthy();
    });

    it("should apply className", () => {
      const { container } = render(<SvgClose className="custom-class" />);
      const svg = container.querySelector("svg");
      expect(svg.className.baseVal).toContain("custom-class");
    });
  });
});
