"use client";
import Paragraph from "@/components/common/Paragraph";
import Title from "@/components/common/Title";
import Vertical from "@/components/common/Vertical";
import { useStyling } from "@/context/ContextStyling";

export default function EmptyState({ title, description, icon }) {
  const { styling } = useStyling();

  return (
    <div className={`${styling.components.card} ${styling.general.box} ${styling.flex.col_center} text-center space-y-4`}>
      {icon && (
        <div className="text-base-content/20">
          {icon}
        </div>
      )}
      <Vertical>
        <Title>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </Vertical>
    </div>
  );
}
