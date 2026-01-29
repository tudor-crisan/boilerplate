import TextSmall from "@/modules/general/components/common/TextSmall";
import React from "react";

export default function AnalyticsStats({ items = [], styling }) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={`grid grid-cols-2 gap-2 sm:grid-cols-${Math.min(items.length, 4)}`}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styling?.components?.card || "bg-base-100 rounded-box"} p-3 ${styling.flex.col_center} text-center`}
        >
          <TextSmall className="mb-1">{item.label}</TextSmall>
          <span
            className={`text-xl font-bold leading-none ${item.color || ""}`}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
