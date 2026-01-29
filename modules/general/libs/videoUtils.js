/**
 * Resolves the image source for video slides.
 * @param {string} image - The image path or filename.
 * @returns {string} - The resolved image path.
 */
export const resolveImagePath = (image) => {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) {
    return image;
  }
  return `/assets/video/loyalboards/${image}`;
};

/**
 * Returns the CSS classes for text sizing based on the slide orientation and type.
 * @param {string} size - The size key ('title', 'subtitle', etc.)
 * @param {boolean} isVertical - Whether the orientation is vertical (9:16).
 * @returns {string} - CSS classes.
 */
export const getTextSizeClasses = (size, isVertical) => {
  if (isVertical) {
    if (size === "title") return "text-3xl sm:text-4xl md:text-5xl";
    if (size === "subtitle") return "text-lg sm:text-xl md:text-2xl";
    return "text-xs sm:text-sm";
  }
  if (size === "title") return "text-3xl sm:text-5xl md:text-6xl lg:text-7xl";
  if (size === "subtitle") return "text-xl sm:text-2xl md:text-3xl lg:text-4xl";
  return "text-sm sm:text-base md:text-lg";
};
