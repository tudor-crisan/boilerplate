"use client";
import { useEffect, useState } from "react";
import copywritings from "@/libs/copywritings.js";
import settings from "@/data/settings.json";
import { CopywritingContext } from "@/components/base/CopywritingContext";

export default function CopywritingWrapper({ children }) {
  const defaultCopywriting = copywritings[settings.copywriting];
  const [copywriting, setCopywriting] = useState(defaultCopywriting);

  const shuffleCopywriting = () => {
    if (settings.shuffle.copywriting.isEnabled) {
      const shuffleCopywriting = localStorage.getItem("shuffle-copywriting") || "";
      if (shuffleCopywriting && copywritings[shuffleCopywriting]) {
        setCopywriting(copywritings[shuffleCopywriting]);
        return;
      }
    }
  }

  useEffect(() => {
    window.addEventListener("shuffle-copywriting", shuffleCopywriting);
    return () => window.removeEventListener("shuffle-copywriting", shuffleCopywriting);
  }, []);

  return (
    <CopywritingContext.Provider value={{ copywriting }}>
      {children}
    </CopywritingContext.Provider>
  );
}
