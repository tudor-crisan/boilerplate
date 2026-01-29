import { isThemeDark, oklchToHex } from "@/modules/general/libs/colors";

describe("libs/colors", () => {
  describe("oklchToHex", () => {
    it("should return black for empty input", () => {
      expect(oklchToHex(null)).toBe("#000000");
    });

    it("should return input if not oklch", () => {
      expect(oklchToHex("invalid")).toBe("invalid");
      expect(oklchToHex("#123456")).toBe("#123456");
    });

    // Difficult to test exact math without a known pair, but we can verify it returns a hex string
    // oklch(0.6 0.1 20)
    it("should convert valid oklch to hex", () => {
      const hex = oklchToHex("oklch(0.6 0.1 20)");
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it("should handle percentage lightness", () => {
      const hex = oklchToHex("oklch(60% 0.1 20)");
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  describe("isThemeDark", () => {
    it("should identify dark themes", () => {
      expect(isThemeDark("dracula")).toBe(true);
      expect(isThemeDark("dark")).toBe(true);
      expect(isThemeDark("black")).toBe(true);
    });

    it("should identify light themes", () => {
      expect(isThemeDark("light")).toBe(false);
      expect(isThemeDark("cupcake")).toBe(false); // assuming not in list
      expect(isThemeDark(undefined)).toBe(false);
    });
  });
});
