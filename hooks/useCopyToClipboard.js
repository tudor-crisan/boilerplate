"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copy = (text) => {
    if (!text) return;

    try {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy to clipboard");
      setIsCopied(false);
    }
  };

  return { isCopied, copy };
}
