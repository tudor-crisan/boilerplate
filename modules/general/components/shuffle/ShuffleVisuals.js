"use client";
import shuffle from "@/modules/general/libs/shuffle";
import visuals from "@/modules/general/lists/visuals";
import { useEffect } from "react";

export default function ShuffleVisuals() {
  useEffect(() => {
    if (!shuffle.visual.isEnabled) return;

    let i = 0;
    const visualKeys = Object.keys(visuals);

    const setVisual = () => {
      const visual = visualKeys[i];
      console.log("Current visual is:", visual);
      localStorage.setItem("shuffle-visual", visual);
      window.dispatchEvent(new Event("shuffle-visual"));
      i++;
    };

    setVisual();

    const visualInterval = setInterval(() => {
      if (i >= visualKeys.length) {
        clearInterval(visualInterval);
        return;
      }
      setVisual();
    }, shuffle.visual.timeInterval);

    return () => clearInterval(visualInterval);
  }, []);

  return null; // nothing to render
}
