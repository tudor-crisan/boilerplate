"use client";
import Paragraph from "@/modules/general/components/common/Paragraph";
import Title from "@/modules/general/components/common/Title";
import Vertical from "@/modules/general/components/common/Vertical";
import { useStyling } from "@/modules/general/context/ContextStyling";

export default function EmptyState({ title, description, icon }) {
  const { styling } = useStyling();

  return (
    <div
      className={`${styling.components.card} ${styling.general.box} ${styling.flex.col_center} text-center space-y-4`}
    >
      {icon && <div className="text-base-content/20">{icon}</div>}
      <Vertical>
        <Title>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </Vertical>
    </div>
  );
}
