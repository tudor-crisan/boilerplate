"use client";
import { toast } from "@/modules/general/libs/toast";
import { useState } from "react";

export default function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (text) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
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
