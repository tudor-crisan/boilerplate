"use client";
import { ContextVisual } from "@/modules/general/context/ContextVisual";
import { defaultVisual } from "@/modules/general/libs/defaults";
import shuffle from "@/modules/general/libs/shuffle";
import visuals from "@/modules/general/lists/visuals";
import { useEffect, useState } from "react";

export default function WrapperVisual({ children }) {
  const [visual, setVisual] = useState(defaultVisual);

  const shuffleVisual = () => {
    if (shuffle.visual.isEnabled) {
      const shuffleVisual = localStorage.getItem("shuffle-visual") || "";
      if (shuffleVisual && visuals[shuffleVisual]) {
        setVisual(visuals[shuffleVisual]);
        return;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("shuffle-visual", shuffleVisual);
    return () => window.removeEventListener("shuffle-visual", shuffleVisual);
  }, []);

  return (
    <ContextVisual.Provider value={{ visual }}>
      {children}
    </ContextVisual.Provider>
  );
}
