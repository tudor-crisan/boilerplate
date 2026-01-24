"use client";
import { useStyling } from "@/context/ContextStyling";
import Link from "next/link";

export default function Dropdown({ label, items, children, className = "" }) {
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
        className={`dropdown-content p-2 bg-base-100 shadow-xl z-[100] ${styling.components.dropdown}`}
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
