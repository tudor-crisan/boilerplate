"use client";
import { useEffect } from "react";
import stylings from "@/libs/styling";
import settings from "@/config/settings.json";

export default function ShuffleStylings() {
  useEffect(() => {
    if (!settings.shuffle.styling.isEnabled) return;

    let i = 0;
    const stylingKeys = Object.keys(stylings);

    const setStyling = () => {
      const styling = stylingKeys[i];
      console.log("Current styling is:", styling);
      localStorage.setItem("shuffle-styling", styling);
      window.dispatchEvent(new Event("shuffle-styling"));
      i++;
    };

    setStyling();

    const stylingInterval = setInterval(() => {
      if (i >= stylingKeys.length) {
        clearInterval(stylingInterval);
        return;
      }
      setStyling();
    }, settings.shuffle.styling.timeInterval);

    return () => clearInterval(stylingInterval);
  }, []);

  return null; // nothing to render
}
