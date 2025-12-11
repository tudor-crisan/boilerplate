"use client";

import { useEffect } from "react";
import logos from "@/libs/logos";
import settings from "@/data/settings";

export default function ShuffleLogo() {
  useEffect(() => {
    if (!settings.shuffle.logo.isEnabled) return;

    let i = 0;
    const logoKeys = Object.keys(logos);

    const setLogo = () => {
      const logo = logoKeys[i];
      console.log("Current logo is:", logo);
      localStorage.setItem("shuffle-logo", logo);
      window.dispatchEvent(new Event("shuffle-logo"));
      i++;
    };

    setLogo();

    const logoInterval = setInterval(() => {
      if (i >= logoKeys.length) {
        clearInterval(logoInterval);
        return;
      }
      setLogo();
    }, settings.shuffle.logo.timeInterval);

    return () => clearInterval(logoInterval);
  }, []);

  return null; // nothing to render
}
