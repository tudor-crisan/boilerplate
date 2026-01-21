"use client";
import { useStyling } from "@/context/ContextStyling";
import Link from "next/link";

export default function Dropdown({ label, items }) {
  const { styling } = useStyling();

  return (
    <div className="dropdown dropdown-end dropdown-hover">
      <div
        tabIndex={0}
        role="button"
        className={`${styling.components.element} btn btn-ghost shadow-none!`}
      >
        {label}
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content menu p-2 bg-base-100 w-52 ${styling.components.dropdown}`}
      >
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
