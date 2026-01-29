import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";

describe("hooks/useHighlight", () => {
  let useHighlight, escapeRegExp, stripHtml;

  beforeAll(async () => {
    jest.unstable_mockModule("@/modules/general/context/ContextStyling", () => ({
      useStyling: () => ({
        styling: { theme: "light" },
      }),
    }));

    jest.unstable_mockModule("@/modules/general/libs/colors", () => ({
      isThemeDark: jest.fn(() => false),
    }));

    const highlightModule = await import("@/modules/general/hooks/useHighlight");
    useHighlight = highlightModule.default;
    escapeRegExp = highlightModule.escapeRegExp;
    stripHtml = highlightModule.stripHtml;
  });

  describe("escapeRegExp", () => {
    it("should escape special regex characters", () => {
      expect(escapeRegExp("test.string")).toBe("test\\.string");
      expect(escapeRegExp("test*string")).toBe("test\\*string");
      expect(escapeRegExp("test+string")).toBe("test\\+string");
      expect(escapeRegExp("test?string")).toBe("test\\?string");
      expect(escapeRegExp("test[string]")).toBe("test\\[string\\]");
    });
  });

  describe("stripHtml", () => {
    it("should strip HTML tags", () => {
      expect(stripHtml("<p>Hello</p>")).toBe("Hello");
      expect(stripHtml("<div><span>Test</span></div>")).toBe("Test");
      expect(stripHtml("No tags")).toBe("No tags");
    });

    it("should return empty string for empty input", () => {
      expect(stripHtml("")).toBe("");
      expect(stripHtml(null)).toBe("");
    });
  });

  describe("HighlightedText component", () => {
    it("should render text without highlight", () => {
      const TestComponent = () => {
        const { HighlightedText } = useHighlight();
        return <HighlightedText text="Hello World" highlight="" />;
      };

      render(<TestComponent />);
      expect(screen.getByText("Hello World")).toBeTruthy();
    });

    it("should highlight matching text", () => {
      const TestComponent = () => {
        const { HighlightedText } = useHighlight();
        return <HighlightedText text="Hello World" highlight="World" />;
      };

      const { container } = render(<TestComponent />);
      const highlighted = container.querySelector(".bg-yellow-200");
      expect(highlighted).toBeTruthy();
      expect(highlighted.textContent).toBe("World");
    });

    it("should handle case-insensitive highlighting", () => {
      const TestComponent = () => {
        const { HighlightedText } = useHighlight();
        return <HighlightedText text="Hello World" highlight="world" />;
      };

      const { container } = render(<TestComponent />);
      const highlighted = container.querySelector(".bg-yellow-200");
      expect(highlighted).toBeTruthy();
    });

    it("should return plain text when no highlight provided", () => {
      const TestComponent = () => {
        const { HighlightedText } = useHighlight();
        return <HighlightedText text="Hello" highlight={null} />;
      };

      render(<TestComponent />);
      expect(screen.getByText("Hello")).toBeTruthy();
    });
  });
});
