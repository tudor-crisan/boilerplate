"use client";
import { createContext, useContext } from "react";

export const ContextAuth = createContext(null);

export function useAuth() {
  return useContext(ContextAuth);
}
