"use client";
import { createContext, useContext } from "react";

export const ContextStyling = createContext(null);

export function useStyling() {
  return useContext(ContextStyling);
}
