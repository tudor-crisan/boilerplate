import { getTextSizeClasses, resolveImagePath } from "@/libs/videoUtils";

describe("libs/videoUtils", () => {
  describe("resolveImagePath", () => {
    it("should return empty if no image", () => {
      expect(resolveImagePath(null)).toBe("");
      expect(resolveImagePath("")).toBe("");
    });

    it("should return straight path if http or /", () => {
      expect(resolveImagePath("http://example.com/img.jpg")).toBe(
        "http://example.com/img.jpg",
      );
      expect(resolveImagePath("/local/img.jpg")).toBe("/local/img.jpg");
    });

    it("should prepend asset path if filename", () => {
      expect(resolveImagePath("file.jpg")).toBe(
        "/assets/video/loyalboards/file.jpg",
      );
    });
  });

  describe("getTextSizeClasses", () => {
    it("should return vertical sizes", () => {
      expect(getTextSizeClasses("title", true)).toContain("text-3xl");
      expect(getTextSizeClasses("subtitle", true)).toContain("text-lg");
      expect(getTextSizeClasses("body", true)).toContain("text-xs");
    });

    it("should return horizontal sizes", () => {
      expect(getTextSizeClasses("title", false)).toContain(
        "text-3xl sm:text-5xl",
      ); // bigger than vertical
      expect(getTextSizeClasses("subtitle", false)).toContain("text-xl");
      expect(getTextSizeClasses("body", false)).toContain("text-sm");
    });
  });
});
