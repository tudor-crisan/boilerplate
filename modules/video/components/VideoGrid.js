import Grid from "@/components/common/Grid";
import Paragraph from "@/components/common/Paragraph";
import Title from "@/components/common/Title";
import VideoCard from "@/modules/video/components/VideoCard";

export default function VideoGrid({
  videos,
  styling,
  onView,
  onEdit,
  onDelete,
  onViewExports,
}) {
  return (
    <div className="space-y-12">
      <div>
        <Title
          tag="h2"
          className={`text-2xl font-bold capitalize mb-4 border-b border-base-300 pb-2 ${styling.components.header}`}
        >
          All Videos ({videos.length})
        </Title>

        <Grid>
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              styling={styling}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewExports={onViewExports}
            />
          ))}
        </Grid>

        {videos.length === 0 && (
          <div className="text-center py-8">
            <Paragraph>No videos match your filters.</Paragraph>
          </div>
        )}
      </div>
    </div>
  );
}
