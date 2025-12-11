"use client";
import { useEffect } from "react";
import copywritings from "@/libs/copywritings";
import settings from "@/config/settings.json";

export default function ShuffleCopywritings() {
  useEffect(() => {
    if (!settings.shuffle.copywriting.isEnabled) return;

    let i = 0;
    const copywritingKeys = Object.keys(copywritings);

    const setCopywriting = () => {
      const copywriting = copywritingKeys[i];
      console.log("Current copywriting is:", copywriting);
      localStorage.setItem("shuffle-copywriting", copywriting);
      window.dispatchEvent(new Event("shuffle-copywriting"));
      i++;
    };

    setCopywriting();

    const copywritingInterval = setInterval(() => {
      if (i >= copywritingKeys.length) {
        clearInterval(copywritingInterval);
        return;
      }
      setCopywriting();
    }, settings.shuffle.copywriting.timeInterval);

    return () => clearInterval(copywritingInterval);
  }, []);

  return null; // nothing to render
}
