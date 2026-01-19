"use client";
import { useStyling } from "@/context/ContextStyling";
import { cn } from "@/libs/utils.client";

export default function SectionWrapper({
  id,
  className,
  containerClassName,
  children,
  background = "bg-base-100",
  padding
}) {
  const { styling } = useStyling();

  const defaultPadding = styling?.[`Section${id?.charAt(0).toUpperCase()}${id?.slice(1)}`]?.padding || "";

  return (
    <section
      id={id}
      className={cn(
        styling.general.box,
        background,
        padding || defaultPadding,
        className
      )}
    >
      <div className={cn(styling.general.container, containerClassName)}>
        {children}
      </div>
    </section>
  );
}
