"use client";
import { createContext, useContext } from "react";
import { defaultStyling } from "@/libs/defaults";

export const ContextStyling = createContext({ styling: defaultStyling });

export function useStyling() {
  return useContext(ContextStyling);
}
