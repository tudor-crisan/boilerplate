"use client";
import { useStyling } from "@/modules/general/context/ContextStyling";

export default function WrapperHeader({ children }) {
  const { styling } = useStyling();
  return (
    <div
      className={`${styling.general.container} ${styling.components.header} ${styling.flex.between}`}
    >
      {children}
    </div>
  );
}
