"use client";
import Link from "next/link";
import { useStyling } from "@/context/ContextStyling";
import IconLoading from "@/components/icon/IconLoading";
import { useState } from "react";

export default function Button({
  className = "",
  variant = "btn-primary",
  size = "btn-sm sm:btn-md",
  isLoading = false,
  disabled = false,
  href = null,
  startIcon = null,
  endIcon = null,
  children,
  onClick,
  ...props
}) {
  const { styling } = useStyling();
  const [internalLoading, setInternalLoading] = useState(false);

  const baseClasses = `${styling.roundness[0]} ${styling.shadows[0]} btn ${variant} ${size} ${className}`;
  const isButtonLoading = isLoading || internalLoading;
  const isDisabled = disabled || isButtonLoading;

  const handleClick = async (e) => {
    // If specific onClick is provided
    if (onClick) {
      const result = onClick(e);

      // Check if it's a promise (async function)
      if (result instanceof Promise) {
        setInternalLoading(true);
        try {
          await result;
        } catch (error) {
          console.error("Button click error:", error);
        } finally {
          // If component is still mounted (check implied by React state update behavior)
          setInternalLoading(false);
        }
      }
    }
  };

  if (href) {
    if (isDisabled) {
      // Render as button if disabled to prevent navigation and keep consistent disabled state styling
      return (
        <button className={baseClasses} disabled={true} {...props}>
          {isButtonLoading && <IconLoading />}
          {startIcon && !isButtonLoading && startIcon}
          {children}
          {endIcon}
        </button>
      )
    }
    return (
      <Link href={href} className={baseClasses} onClick={handleClick} {...props}>
        {startIcon}
        {children}
        {endIcon}
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
      {isButtonLoading && <IconLoading />}
      {startIcon && !isButtonLoading && startIcon}
      {children}
      {endIcon}
    </button>
  );
}
