"use client";
import shuffle from "@/libs/shuffle";
import copywritings from "@/lists/copywritings";
import { useEffect } from "react";

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
