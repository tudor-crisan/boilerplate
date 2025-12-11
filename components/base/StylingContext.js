"use client";
import { createContext, useContext } from "react";

export const StylingContext = createContext(null);

export function useStyling() {
  return useContext(StylingContext);
}
