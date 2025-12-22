  "use client";
import Link from "next/link";
import { useStyling } from "@/context/ContextStyling";
import IconLoading from "@/components/icon/IconLoading";

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

  const baseClasses = `btn ${variant} ${size} ${styling.roundness[0]} ${styling.shadows[0]} ${className}`;
  const isDisabled = disabled || isLoading;

  if (href) {
    if (isDisabled) {
      // Render as button if disabled to prevent navigation and keep consistent disabled state styling
      return (
        <button className={baseClasses} disabled={true} {...props}>
          {isLoading && <IconLoading />}
          {startIcon && !isLoading && startIcon}
          {children}
          {endIcon}
        </button>
      )
    }
    return (
      <Link href={href} className={baseClasses} {...props}>
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
      onClick={onClick}
      {...props}
    >
      {isLoading && <IconLoading />}
      {startIcon && !isLoading && startIcon}
      {children}
      {endIcon}
    </button>
  );
}
