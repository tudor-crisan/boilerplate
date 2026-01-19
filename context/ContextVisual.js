"use client";
import { createContext, useContext } from "react";
import { defaultVisual } from "@/libs/defaults";

export const ContextVisual = createContext({ visual: defaultVisual });

export function useVisual() {
  return useContext(ContextVisual);
}
