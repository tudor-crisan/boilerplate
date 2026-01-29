import Button from "@/modules/general/components/button/Button";
import Paragraph from "@/modules/general/components/common/Paragraph";
import Title from "@/modules/general/components/common/Title";

export default function VideoHeader({ styling, onOpenCreate }) {
  return (
    <div className="text-center mb-8 relative space-y-2">
      <Title className={styling.section.title}>Video Generator</Title>
      <Paragraph className={styling.section.paragraph}>
        Select a video script to visualize and record, or create a new one.
      </Paragraph>
      <div className="mt-4">
        <Button onClick={onOpenCreate} variant="btn-primary">
          + Create New Video
        </Button>
      </div>
    </div>
  );
}
