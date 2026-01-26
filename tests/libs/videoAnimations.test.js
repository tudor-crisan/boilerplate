import { getAnimationVariants } from "@/libs/videoAnimations";

describe("libs/videoAnimations", () => {
  it("should return variants for known types", () => {
    const types = [
      "zoom",
      "slide-left",
      "slide-right",
      "slide-up",
      "flip",
      "rotate",
      "bounce",
    ];

    types.forEach((type) => {
      const variant = getAnimationVariants(type);
      expect(variant).toHaveProperty("initial");
      expect(variant).toHaveProperty("animate");
      expect(variant).toHaveProperty("exit");
    });
  });

  it("should return default fade variant for unknown type", () => {
    const variant = getAnimationVariants("unknown");
    expect(variant).toHaveProperty("initial");
    // Check specific fade props from code
    expect(variant.initial).toEqual({ scale: 0.95, opacity: 0 });
  });
});
