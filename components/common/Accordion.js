"use client";
import { useState } from "react";
import { useStyling } from "@/context/ContextStyling";

export default function Accordion({ items, allowMultiple = true, className = "" }) {
  const { styling } = useStyling();
  const [openIndices, setOpenIndices] = useState([0]);

  const handleToggle = (index) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styling.components.card} collapse collapse-arrow bg-base-200 ${openIndices.includes(index) ? "collapse-open" : ""}`}
        >
          <input
            type="checkbox"
            className="peer"
            checked={openIndices.includes(index)}
            onChange={() => handleToggle(index)}
          />
          <div className="collapse-title font-semibold text-primary cursor-pointer">
            {item.title}
          </div>
          <div className="collapse-content text-sm">
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
}
