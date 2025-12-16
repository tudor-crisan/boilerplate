"use client";
import { createContext, useContext } from "react";

export const ContextCopywriting = createContext(null);

export function useCopywriting() {
  return useContext(ContextCopywriting);
}
