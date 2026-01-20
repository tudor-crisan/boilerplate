"use client";
import { defaultStyling } from "@/libs/defaults";
import { createContext, useContext } from "react";

export const ContextStyling = createContext({ styling: defaultStyling });

export function useStyling() {
  return useContext(ContextStyling);
}
