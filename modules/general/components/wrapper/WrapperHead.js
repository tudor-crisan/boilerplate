"use client";

import ThemeScript from "@/modules/general/components/wrapper/ThemeScript";

export default function WrapperHead({ children }) {
  return (
    <head>
      <ThemeScript />
      {children}
    </head>
  );
}
