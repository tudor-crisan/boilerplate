"use client";

import { ContextAuth } from "@/context/ContextAuth";

export default function WrapperAuthClient({ authSession, children }) {
  return (
    <ContextAuth.Provider value={authSession}>
      {children}
    </ContextAuth.Provider>
  );
}
