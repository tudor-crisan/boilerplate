"use client";
import shuffle from "@/modules/general/libs/shuffle";
import fonts from "@/modules/general/lists/fonts";
import { useEffect } from "react";

export default function ShuffleFonts() {
  useEffect(() => {
    if (!shuffle.font.isEnabled) return;

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
    }, shuffle.font.timeInterval);

    return () => clearInterval(fontInterval);
  }, []);

  return null; // nothing to render
}
