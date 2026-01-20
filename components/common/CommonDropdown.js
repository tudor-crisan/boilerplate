import Link from "next/link";
import { useStyling } from "@/context/ContextStyling";

export default function CommonDropdown({ label, items }) {
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
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
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
