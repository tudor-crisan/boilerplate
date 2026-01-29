"use client";
import shuffle from "@/modules/general/libs/shuffle";
import themes from "@/modules/general/lists/themes";
import { useEffect } from "react";

export default function ShuffleThemes() {
  useEffect(() => {
    if (!shuffle.theme.isEnabled) return;

    let i = 0;
    const htmlElement = document.documentElement; // safer + faster

    const setTheme = () => {
      const theme = themes[i];
      console.log("Current theme is:", theme);
      htmlElement.setAttribute("data-theme", theme);
      i++;
    };

    setTheme();

    const themeInterval = setInterval(() => {
      if (i >= themes.length) {
        clearInterval(themeInterval);
        return;
      }
      setTheme();
    }, shuffle.theme.timeInterval);

    return () => clearInterval(themeInterval);
  }, []);

  return null; // nothing to render
}
