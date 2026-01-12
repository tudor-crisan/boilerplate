"use client";
import { useEffect, useState } from "react";
import { defaultStyling } from "@/libs/defaults";
import stylings from "@/lists/stylings";
import shuffle from "@/libs/shuffle";
import { ContextStyling } from "@/context/ContextStyling";

export default function WrapperStyling({ children }) {
  const [styling, setStyling] = useState(defaultStyling);

  // Load styling from local storage on mount
  useEffect(() => {
    const savedStyling = localStorage.getItem("styling-config");
    if (savedStyling) {
      try {
        setStyling(JSON.parse(savedStyling));
      } catch (e) {
        console.error("Failed to parse saved styling:", e);
      }
    }
  }, []);

  // Save styling to local storage specifically when setStyling is called from the UI
  // We need to wrap setStyling or monitor it. Since we expose setStyling, we can't easily wrap it in the context value without changing the signature.
  // Instead, let's use an effect that runs when styling changes.
  useEffect(() => {
    // We only want to save if it's different from default, but for now let's just save valid updates.
    // However, defaultStyling loads initially. We don't want to overwrite user's possible "shuffle" with default if shuffle is active.
    // But the user asked to persist THESE settings.
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
