"use client";
import { useStyling } from "@/context/ContextStyling";
import Link from "next/link";

export default function Dropdown({
  label,
  items,
  children,
  className = "",
  contentClassName = "p-2",
}) {
  const { styling } = useStyling();

  return (
    <div className={`dropdown dropdown-hover ${className}`}>
      <div
        tabIndex={0}
        role="button"
        className={`${styling.components.element} btn btn-ghost shadow-none!`}
      >
        {label}
      </div>
      <div
        tabIndex={0}
        className={`dropdown-content bg-base-100 shadow-xl z-100 ${contentClassName} ${styling.components.dropdown}`}
      >
        {children ? (
          children
        ) : (
          <ul className="menu p-0 w-52">
            {items?.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
