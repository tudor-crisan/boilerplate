import { resolveImagePath, getTextSizeClasses } from "../videoUtils";
import { getAnimationVariants } from "../videoAnimations";

describe("Video Utilities", () => {
  describe("resolveImagePath", () => {
    it("should resolve relative image paths", () => {
      expect(resolveImagePath("test.jpg")).toBe("/assets/video/loyalboards/test.jpg");
    });

    it("should return absolute paths as is", () => {
      expect(resolveImagePath("/custom/path.jpg")).toBe("/custom/path.jpg");
      expect(resolveImagePath("http://example.com/img.jpg")).toBe("http://example.com/img.jpg");
    });

    it("should return empty string for null/undefined", () => {
      expect(resolveImagePath(null)).toBe("");
    });
  });

  describe("getTextSizeClasses", () => {
    it("should return correct classes for vertical orientation", () => {
      expect(getTextSizeClasses("title", true)).toContain("text-3xl");
      expect(getTextSizeClasses("subtitle", true)).toContain("text-lg");
    });

    it("should return correct classes for horizontal orientation", () => {
      expect(getTextSizeClasses("title", false)).toContain("text-3xl sm:text-5xl");
    });
  });

  describe("getAnimationVariants", () => {
    it("should return default fade variants for unknown type", () => {
      const variants = getAnimationVariants("unknown");
      expect(variants.initial).toEqual({ scale: 0.95, opacity: 0 });
    });

    it("should return correct variants for zoom", () => {
      const variants = getAnimationVariants("zoom");
      expect(variants.initial).toEqual({ scale: 0.8, opacity: 0 });
    });
  });
});
