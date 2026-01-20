"use client";
import { ContextStyling } from "@/context/ContextStyling";
import { defaultStyling } from "@/libs/defaults";
import { deepMerge } from "@/libs/merge.mjs";
import shuffle from "@/libs/shuffle";
import stylings from "@/lists/stylings";
import { useEffect, useLayoutEffect,useState } from "react";

export default function WrapperStyling({ children }) {
  const [styling, setStyling] = useState(defaultStyling);

  // Load styling from local storage on mount to prevent flicker
  // useLayoutEffect ensures state update happens before paint
  useLayoutEffect(() => {
    const savedStyling = localStorage.getItem("styling-config");
    if (savedStyling) {
      try {
        setStyling(deepMerge(defaultStyling, JSON.parse(savedStyling)));
      } catch (e) {
        console.error("Failed to parse saved styling:", e);
      }
    }
  }, []);

  // Sync styling changes to local storage (as a cache)
  useEffect(() => {
    if (styling !== defaultStyling) {
      localStorage.setItem("styling-config", JSON.stringify(styling));
    }
  }, [styling]);

  const shuffleStyling = () => {
    if (shuffle.styling.isEnabled) {
      const shuffleStyling = localStorage.getItem("shuffle-styling") || "";
      if (shuffleStyling && stylings[shuffleStyling]) {
        setStyling(deepMerge(defaultStyling, stylings[shuffleStyling]));
        return;
      }
    }
  }

  useEffect(() => {
    window.addEventListener("shuffle-styling", shuffleStyling);
    return () => window.removeEventListener("shuffle-styling", shuffleStyling);
  }, []);

  return (
    <ContextStyling.Provider value={{ styling, setStyling }}>
      {children}
    </ContextStyling.Provider>
  );
}
