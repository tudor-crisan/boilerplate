"use client";
import { defaultCopywriting } from "@/modules/general/libs/defaults";
import { createContext, useContext } from "react";

export const ContextCopywriting = createContext({
  copywriting: defaultCopywriting,
});

export function useCopywriting() {
  return useContext(ContextCopywriting);
}
