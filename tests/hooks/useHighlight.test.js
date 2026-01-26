import { jest } from "@jest/globals";
import { renderHook } from "@testing-library/react";

describe("hooks/useHighlight", () => {
  let useHighlight;
  let useStylingMock;

  beforeAll(async () => {
    // Mock useStyling
    useStylingMock = jest.fn(() => ({
      styling: { theme: "light" },
    }));

    jest.unstable_mockModule("@/context/ContextStyling", () => ({
      useStyling: useStylingMock,
    }));
    jest.unstable_mockModule("@/libs/colors", () => ({
      isThemeDark: (theme) => theme === "dracula",
    }));

    const importedModule = await import("../../hooks/useHighlight");
    useHighlight = importedModule.default;
  });

  it("should strip HTML", () => {
    const { result } = renderHook(() => useHighlight());
    expect(result.current.stripHtml("<p>Hello</p>")).toBe("Hello");
    expect(result.current.stripHtml("<div><span>World</span></div>")).toBe(
      "World",
    );
    expect(result.current.stripHtml(null)).toBe("");
  });

  it("should escape regex characters", () => {
    const { result } = renderHook(() => useHighlight());
    expect(result.current.escapeRegExp("hello.world")).toBe("hello\\.world");
    expect(result.current.escapeRegExp("(test)")).toBe("\\(test\\)");
  });

  // Test HighlightedText component if possible, but it's returned by the hook.
  // Testing inner components returned by hooks is valid but can be tricky with rendering.
  // We can call the function directly if it's exposed or render it in a component.
  // The hook returns { HighlightedText, ... }

  // Testing HighlightedText:
  // It's a component. We can render it.

  // Note: Since we are mocking dependencies, we need to ensure the hook logic uses them correctly.
});
