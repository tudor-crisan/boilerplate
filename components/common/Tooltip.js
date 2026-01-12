"use client";
import { useStyling } from "@/context/ContextStyling";
import useTooltip from "@/hooks/useTooltip";

export default function Tooltip({ children, text, isVisible: externalIsVisible }) {
  const { styling } = useStyling();
  const { isVisible: internalIsVisible, show, hide } = useTooltip();

  const isControlled = externalIsVisible !== undefined;
  const isVisible = isControlled ? externalIsVisible : internalIsVisible;

  const handleMouseEnter = () => !isControlled && show();
  const handleMouseLeave = () => !isControlled && hide();

  if (!text) return children;

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isVisible && (
        <div className="absolute bottom-full mb-2 flex flex-col items-center z-50 pointer-events-none">
          <div className={`${styling.components.element} bg-neutral text-neutral-content sm:text-sm text-xs p-2.5 whitespace-nowrap font-medium leading-none`}>
            {text}
          </div>
          <div className="size-2 bg-neutral rotate-45 -mt-1"></div>
        </div>
      )}
      {children}
    </div>
  );
}
