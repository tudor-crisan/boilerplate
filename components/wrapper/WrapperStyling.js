"use client";
import { useEffect, useState } from "react";
import stylings from "@/libs/styling";
import settings from "@/config/settings.json";
import { ContextStyling } from "@/components/context/ContextStyling";

export default function WrapperStyling({ children }) {
  const defaultStyling = stylings[settings.styling];
  const [styling, setStyling] = useState(defaultStyling);

  const shuffleStyling = () => {
    if (settings.shuffle.styling.isEnabled) {
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
