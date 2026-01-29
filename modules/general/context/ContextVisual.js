"use client";
import { defaultVisual } from "@/modules/general/libs/defaults";
import { createContext, useContext } from "react";

export const ContextVisual = createContext({ visual: defaultVisual });

export function useVisual() {
  return useContext(ContextVisual);
}
