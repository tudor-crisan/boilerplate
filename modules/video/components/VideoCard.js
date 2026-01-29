import Button from "@/modules/general/components/button/Button";
import TextSmall from "@/modules/general/components/common/TextSmall";
import Title from "@/modules/general/components/common/Title";
import SvgEdit from "@/modules/general/components/svg/SvgEdit";
import SvgTrash from "@/modules/general/components/svg/SvgTrash";
import SvgView from "@/modules/general/components/svg/SvgView";
import { formattedDate } from "@/modules/general/libs/utils.client";

export default function VideoCard({
  video,
  styling,
  onView,
  onEdit,
  onDelete,
  onViewExports,
}) {
  return (
    <div
      onClick={() => onView(video)}
      className={`${styling.components.card} cursor-pointer hover:scale-[1.02] transition-transform group relative`}
      role="button"
      tabIndex={0}
    >
      <div className="card-body">
        <div className="flex justify-between items-start mb-2 pr-6">
          <Title tag="h3" className="card-title text-primary text-lg">
            {video.title}
          </Title>
        </div>

        <div
          className={`${styling?.components?.element || ""} badge badge-outline`}
        >
          {video.format}
        </div>

        <TextSmall className="mt-2 text-base-content/60 flex items-center gap-1 flex-wrap">
          <span>{video.slides?.length || 0} slides</span>
          <span>•</span>
          <span>
            {video.width}x{video.height}
          </span>
        </TextSmall>
        <TextSmall className="text-[10px] opacity-40 font-mono mt-1 block">
          {formattedDate(video.createdAt)}
        </TextSmall>

        <div className="flex justify-end">
          <Button
            size="btn-sm"
            variant="btn-outline join-item"
            onClick={(e) => onViewExports(e, video.id)}
          >
            Exports
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            onClick={() => onView(video)}
            variant="btn-ghost btn-square"
            size="btn-xs"
            className="bg-base-100/80"
            title="View"
          >
            <SvgView />
          </Button>
          <Button
            onClick={(e) => onEdit(e, video)}
            variant="btn-ghost btn-square"
            size="btn-xs"
            className="bg-base-100/80"
            title="Edit"
          >
            <SvgEdit />
          </Button>
          <Button
            onClick={(e) => onDelete(e, video.id)}
            variant="btn-ghost btn-square"
            size="btn-xs"
            className="bg-base-100/80 text-error"
            title="Delete"
          >
            <SvgTrash />
          </Button>
        </div>
      </div>
    </div>
  );
}
