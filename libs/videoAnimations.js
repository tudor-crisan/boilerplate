export const getAnimationVariants = (type) => {
  switch (type) {
    case "zoom":
      return {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.2, opacity: 0 },
      };
    case "slide-left":
      return {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 },
      };
    case "slide-right":
      return {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 100, opacity: 0 },
      };
    case "slide-up":
      return {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -100, opacity: 0 },
      };
    case "flip":
      return {
        initial: { rotateY: 90, opacity: 0 },
        animate: { rotateY: 0, opacity: 1 },
        exit: { rotateY: -90, opacity: 0 },
      };
    case "rotate":
      return {
        initial: { rotate: -180, scale: 0, opacity: 0 },
        animate: {
          rotate: 0,
          scale: 1,
          opacity: 1,
          transition: { type: "spring", stiffness: 200 },
        },
        exit: { rotate: 180, scale: 0, opacity: 0 },
      };
    case "bounce":
      return {
        initial: { y: 50, opacity: 0 },
        animate: {
          y: 0,
          opacity: 1,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        },
        exit: { y: -50, opacity: 0 },
      };
    default: // fade
      return {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { opacity: 0 },
      };
  }
};
