"use client";
import { useEffect, useState } from "react";
import { defaultCopywriting } from "@/libs/defaults";
import copywritings from "@/lists/copywritings.js";
import shuffle from "@/libs/shuffle";
import { ContextCopywriting } from "@/context/ContextCopywriting";

export default function WrapperCopywriting({ children }) {
  const [copywriting, setCopywriting] = useState(defaultCopywriting);

  const shuffleCopywriting = () => {
    if (shuffle.copywriting.isEnabled) {
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
    <ContextCopywriting.Provider value={{ copywriting }}>
      {children}
    </ContextCopywriting.Provider>
  );
}
