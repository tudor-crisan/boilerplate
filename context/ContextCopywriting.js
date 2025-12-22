"use client";
import { createContext, useContext } from "react";
import { defaultStyling } from "@/libs/defaults";

export const ContextCopywriting = createContext({ copywriting: defaultStyling });

export function useCopywriting() {
  return useContext(ContextCopywriting);
}
