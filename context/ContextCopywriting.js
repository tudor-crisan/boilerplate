"use client";
import { createContext, useContext } from "react";
import { defaultCopywriting } from "@/libs/defaults";

export const ContextCopywriting = createContext({ copywriting: defaultCopywriting });

export function useCopywriting() {
  return useContext(ContextCopywriting);
}
