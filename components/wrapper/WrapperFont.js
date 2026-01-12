"use client";
import { useEffect, useState } from "react";
import fonts from "@/lists/fonts.js";
import { useStyling } from "@/context/ContextStyling";
import shuffle from "@/libs/shuffle";

export default function WrapperFont({ children }) {
  const { styling } = useStyling();
  const defaultFont = fonts[styling.font]?.className || fonts["sen"].className;
  const [fontClass, setFontClass] = useState(defaultFont);

  useEffect(() => {
    if (styling.font && fonts[styling.font]) {
      setFontClass(fonts[styling.font].className);
    }
  }, [styling.font]);

  const shuffleFont = () => {
    if (shuffle.font.isEnabled) {
      const shuffleFont = localStorage.getItem("shuffle-font") || "";
      if (shuffleFont && fonts[shuffleFont]) {
        setFontClass(fonts[shuffleFont].className);
        return;
      }
    }
  }

  useEffect(() => {
    window.addEventListener("shuffle-font", shuffleFont);
    return () => window.removeEventListener("shuffle-font", shuffleFont);
  }, []);

  return (
    <div className={fontClass}>
      {children}
    </div>
  );
}
