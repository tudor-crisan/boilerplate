"use client";

import ThemeScript from "@/components/wrapper/ThemeScript";

export default function WrapperHead({ children }) {
  return (
    <head>
      <ThemeScript />
      {children}
    </head>
  );
}
