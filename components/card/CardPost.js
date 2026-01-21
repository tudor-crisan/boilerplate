"use client";

import Paragraph from "@/components/common/Paragraph";
import Title from "@/components/common/Title";
import { useStyling } from "@/context/ContextStyling";

const CardPost = ({
  title,
  description,
  actions,
  onClick,
  className = "",
  children,
}) => {
  const { styling } = useStyling();

  return (
    <div
      className={`${styling.components.card} ${styling.general.box} block ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-1 min-w-0 flex-1">
          <Title className="wrap-break-word line-clamp-2">{title}</Title>
        </div>

        {actions && (
          <div className={`ml-6 shrink-0 ${styling.flex.items_center} gap-2`}>
            {actions}
          </div>
        )}
      </div>

      <Paragraph className="max-h-32 wrap-break-word">{description}</Paragraph>

      {children}
    </div>
  );
};

export default CardPost;
