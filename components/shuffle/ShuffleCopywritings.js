"use client";
import { useEffect } from "react";
import copywritings from "@/lists/copywritings";
import shuffle from "@/libs/shuffle";

export default function ShuffleCopywritings() {
  useEffect(() => {
    if (!shuffle.copywriting.isEnabled) return;

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
    }, shuffle.copywriting.timeInterval);

    return () => clearInterval(copywritingInterval);
  }, []);

  return null; // nothing to render
}
