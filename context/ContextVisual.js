"use client";
import { createContext, useContext } from "react";

export const ContextVisual = createContext(null);

export function useVisual() {
  return useContext(ContextVisual);
}
