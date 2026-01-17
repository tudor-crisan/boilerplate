"use client";
import { useEffect, useState, useLayoutEffect } from "react";
import { deepMerge } from "@/libs/merge.mjs";
import { defaultStyling } from "@/libs/defaults";
import stylings from "@/lists/stylings";
import shuffle from "@/libs/shuffle";
import { ContextStyling } from "@/context/ContextStyling";

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
        setStyling(stylings[shuffleStyling]);
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
