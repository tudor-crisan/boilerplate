"use client";
import { createContext, useContext } from "react";

export const CopywritingContext = createContext(null);

export function useCopywriting() {
  return useContext(CopywritingContext);
}
