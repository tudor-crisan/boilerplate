"use client";

import { fontMap } from "@/lists/fonts";

const ThemeWrapper = ({
  theme,
  font,
  className = "",
  children
}) => {
  return (
    <div
      data-theme={theme?.toLowerCase()}
      style={{ fontFamily: font ? fontMap[font] : undefined }}
      className={className}
    >
      {children}
    </div>
  );
};

export default ThemeWrapper;
