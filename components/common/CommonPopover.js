import Link from "next/link";
import { useState } from "react";
import SvgChevronRight from "@/components/svg/SvgChevronRight";

export default function CommonPopover({ label, items, onItemClick }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      <button
        className="btn btn-ghost text-lg w-full flex items-center justify-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <SvgChevronRight
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-90" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div className="flex flex-col gap-2 items-center w-full mt-2 animate-fade-in-up">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="btn btn-ghost text-base w-full opacity-80 hover:opacity-100"
              onClick={onItemClick}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
