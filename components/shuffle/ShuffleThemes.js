"use client";

import { useEffect } from "react";
import themes from "@/libs/themes";
import settings from "@/config/settings";

export default function ShuffleThemes() {
  useEffect(() => {
    if (!settings.shuffle.theme.isEnabled) return;

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
    }, settings.shuffle.theme.timeInterval);

    return () => clearInterval(themeInterval);
  }, []);

  return null; // nothing to render
}
