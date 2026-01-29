"use client";
import shuffle from "@/modules/general/libs/shuffle";
import stylings from "@/modules/general/lists/stylings";
import { useEffect } from "react";

export default function ShuffleStylings() {
  useEffect(() => {
    if (!shuffle.styling.isEnabled) return;

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
    }, shuffle.styling.timeInterval);

    return () => clearInterval(stylingInterval);
  }, []);

  return null; // nothing to render
}
