"use client";
import { useEffect, useState } from "react";
import { defaultVisual } from "@/libs/defaults";
import visuals from "@/lists/visuals";
import shuffle from "@/libs/shuffle";
import { ContextVisual } from "@/context/ContextVisual";

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
  }

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
