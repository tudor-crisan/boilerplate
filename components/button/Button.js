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
  noAutoLoading = false,
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
    // Check if modifiers are pressed to skip internal handling (allow default browser behavior like new tab)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button && e.button !== 0)) {
      return;
    }

    // Execute passed onClick first to see if it prevents default
    let promiseResult = null;
    if (onClick) {
      promiseResult = onClick(e);
    }

    // If navigation prevented, we shouldn't act like it's navigating
    const isNavigation = href && !e.defaultPrevented;

    // If it's a navigation link on current tab, set loading
    if (isNavigation && !noAutoLoading) {
      setInternalLoading(true);
    }

    // Handle promise from custom onClick
    if (promiseResult instanceof Promise) {
      // If NOT navigating, we need to set loading for async task
      if (!isNavigation && !noAutoLoading) {
        setInternalLoading(true);
      }

      try {
        await promiseResult;
      } catch (error) {
        console.error("Button click error:", error);
      } finally {
        // Only unset loading if we are NOT on a strictly loading path (href navigation)
        if (!isNavigation && !noAutoLoading) {
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
