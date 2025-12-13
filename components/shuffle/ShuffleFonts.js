"use client";
import { useEffect } from "react";
import fonts from "@/lists/fonts";
import settings from "@/config/settings.json";

export default function ShuffleFonts() {
  useEffect(() => {
    if (!settings.shuffle.font.isEnabled) return;

    let i = 0;
    const fontKeys = Object.keys(fonts);

    const setFont = () => {
      const font = fontKeys[i];
      console.log("Current font is:", font);
      localStorage.setItem("shuffle-font", font);
      window.dispatchEvent(new Event("shuffle-font"));
      i++;
    };

    setFont();

    const fontInterval = setInterval(() => {
      if (i >= fontKeys.length) {
        clearInterval(fontInterval);
        return;
      }
      setFont();
    }, settings.shuffle.font.timeInterval);

    return () => clearInterval(fontInterval);
  }, []);

  return null; // nothing to render
}
