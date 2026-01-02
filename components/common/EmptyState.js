import { useStyling } from "@/context/ContextStyling";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import Vertical from "@/components/common/Vertical";

export default function EmptyState({ title, description, icon }) {
  const { styling } = useStyling();

  return (
    <div className={`${styling.components.card} ${styling.paddings.card} flex flex-col items-center justify-center text-center space-y-4`}>
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
