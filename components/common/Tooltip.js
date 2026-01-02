"use client";

import { useStyling } from "@/context/ContextStyling";

export default function Tooltip({ children, text, isVisible }) {
  const { styling } = useStyling();
  if (!text) return children;

  return (
    <div className="relative flex flex-col items-center">
      {isVisible && (
        <div className="absolute bottom-full mb-2 flex flex-col items-center z-50 pointer-events-none">
          <div className={`${styling.roundness[0]} ${styling.shadows[0]} bg-neutral text-neutral-content sm:text-sm text-xs p-2.5 whitespace-nowrap font-medium leading-none`}>
            {text}
          </div>
          <div className={`${styling.shadows[0]} w-2 h-2 bg-neutral rotate-45 -mt-1`}></div>
        </div>
      )}
      {children}
    </div>
  );
}
