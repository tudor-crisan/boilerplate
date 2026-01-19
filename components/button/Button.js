"use client";
import Link from "next/link";
import { useStyling } from "@/context/ContextStyling";
import IconLoading from "@/components/icon/IconLoading";
import { useState } from "react";
import { cn } from "@/libs/utils.client";

export default function Button({
  className = "",
  variant = "btn-primary",
  size = "btn-sm sm:btn-md",
  isLoading = false,
  disabled = false,
  href = null,
  startIcon = null,
  endIcon = null,
  noAutoLoading = false,
  children,
  onClick,
  ...props
}) {
  const { styling } = useStyling();
  const [internalLoading, setInternalLoading] = useState(false);

  const isButtonLoading = isLoading || internalLoading;
  const isDisabled = disabled || isButtonLoading;

  const isIcon = variant.includes("btn-square") || variant.includes("btn-circle");
  const sizingClass = isIcon ? "" : styling.general.element;

  const baseClasses = cn(
    "btn",
    styling.components.element,
    variant,
    size,
    sizingClass,
    isButtonLoading && "cursor-wait! pointer-events-auto!",
    className
  );

  const handleClick = async (e) => {
    // Check if modifiers are pressed to skip internal handling
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button && e.button !== 0)) {
      return;
    }

    let promiseResult = null;
    if (onClick) {
      promiseResult = onClick(e);
    }

    const isNavigation = href && !e.defaultPrevented;

    if (isNavigation && !noAutoLoading) {
      setInternalLoading(true);
    }

    if (promiseResult instanceof Promise) {
      if (!isNavigation && !noAutoLoading) {
        setInternalLoading(true);
      }

      try {
        await promiseResult;
      } catch (error) {
        console.error("Button click error:", error);
      } finally {
        if (!isNavigation && !noAutoLoading) {
          setInternalLoading(false);
        }
      }
    }
  };

  const content = (
    <>
      {isButtonLoading ? <IconLoading className="w-4 h-4" /> : startIcon}
      {children}
      {endIcon}
    </>
  );

  if (href) {
    if (isDisabled) {
      return (
        <button className={baseClasses} disabled={true} {...props}>
          {content}
        </button>
      );
    }
    return (
      <Link href={href} className={baseClasses} onClick={handleClick} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={baseClasses}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {content}
    </button>
  );
}
