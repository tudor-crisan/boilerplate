"use client";
import { createContext, useContext } from "react";
import { defaultVisual } from "@/libs/defaults";

export const ContextVisual = createContext({ styling: defaultVisual });

export function useVisual() {
  return useContext(ContextVisual);
}
