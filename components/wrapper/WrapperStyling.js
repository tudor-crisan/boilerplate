"use client";
import { useEffect, useState } from "react";
import { defaultStyling } from "@/libs/defaults";
import stylings from "@/lists/stylings";
import shuffle from "@/libs/shuffle";
import { ContextStyling } from "@/context/ContextStyling";

export default function WrapperStyling({ children }) {
  const [styling, setStyling] = useState(defaultStyling);

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
    <ContextStyling.Provider value={{ styling }}>
      {children}
    </ContextStyling.Provider>
  );
}
