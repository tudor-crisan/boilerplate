"use client";
import { useEffect, useState } from "react";
import fonts from "@/libs/fonts.js";
import styling from "@/config/styling.json";
import settings from "@/data/settings.json";

export default function FontWrapper({ children }) {
  const defaultFont = fonts[styling.font].className;
  const [fontClass, setFontClass] = useState(defaultFont);

  const shuffleFont = () => {
    if (settings.shuffle.font.isEnabled) {
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
