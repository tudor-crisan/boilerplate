"use client";
import { createContext, useContext } from "react";

export const ContextAuth = createContext({});

export function useAuth() {
  return useContext(ContextAuth);
}
