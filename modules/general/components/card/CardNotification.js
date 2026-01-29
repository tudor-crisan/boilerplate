"use client";
import Button from "@/modules/general/components/button/Button";
import TextSmall from "@/modules/general/components/common/TextSmall";
import { useStyling } from "@/modules/general/context/ContextStyling";
import React, { useState } from "react";
import clsx from "clsx";

export default function CardNotification({
  isRead,
  isLoading,
  onMarkRead,
  dateFormatted,
  badge,
  title,
  content,
  children,
  className = "",
}) {
  const { styling } = useStyling();
  const [isExpanded, setIsExpanded] = useState(false);

  const isContentLong = content && content.length > 70;

  return (
    <div
      className={clsx(
        `${styling.components.element} ${styling.flex.between} alert opacity-70 items-start ${className}`,
        (!isRead || isLoading) && "border-primary alert-outline opacity-100",
      )}
    >
      <div className={`${styling.flex.col} space-y-1 pt-1 min-w-0 flex-1`}>
        <div className={`${styling.flex.items_center} gap-2`}>
          <TextSmall>{dateFormatted}</TextSmall>
          {badge && (
            <span className="badge badge-xs badge-primary font-bold">
              {badge}
            </span>
          )}
        </div>

        <div className="text-sm">
          {title && <span className="font-bold mr-2">{title}</span>}
          <span
            className={clsx(
              "opacity-80 wrap-break-words",
              !isExpanded && "line-clamp-1 inline",
            )}
          >
            {content}
          </span>
        </div>

        {isContentLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-primary hover:underline mt-1 block"
          >
            {isExpanded ? "View Less" : "View More"}
          </button>
        )}

        {children}
      </div>
      {(!isRead || isLoading) && onMarkRead && (
        <Button
          onClick={onMarkRead}
          variant="btn-outline"
          size="btn-xs"
          className="shrink-0 ml-2 mt-1"
          isLoading={isLoading}
          disabled={isRead}
        >
          Mark Read
        </Button>
      )}
    </div>
  );
}
