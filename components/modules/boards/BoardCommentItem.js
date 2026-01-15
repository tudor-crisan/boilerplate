import { formatCommentDate } from "@/libs/utils.client";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/button/Button";
import SvgTrash from "@/components/svg/SvgTrash";
import TextSmall from "@/components/common/TextSmall";

const BoardCommentItem = ({
  comment,
  user,
  config,
  styling,
  onDelete,
  localCommentIds = [],
}) => {
  const isOwner = comment.userId?._id && comment.boardId?.userId === comment.userId._id;
  const isAuthor = user?.id && comment.userId?._id === user.id;
  const isBoardOwner = user?.id && comment.boardId?.userId === user.id;
  const isLocal = localCommentIds.includes(comment._id);

  const canDelete = config.allowDeletion && (isAuthor || isBoardOwner || isLocal);

  return (
    <div className="flex gap-3 items-start">
      <Avatar
        src={comment.userId?.image}
        initials={(comment.userId?.name || comment.name || "?").substring(0, 2)}
        size="sm"
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-sm">
            {comment.userId?.name || comment.name || "Anonymous"}
            {/* Owner Badge */}
            {isOwner && (
              <span className={`${styling?.components?.element || ""} badge badge-outline badge-xs h-5 pointer-events-none select-none ml-2`}>
                {config.ownerBadgeText || "Owner"}
              </span>
            )}
          </span>

          <div className="flex items-center gap-2">
            {config.showDate && (
              <TextSmall className="line-clamp-2 max-w-20 text-center text-base-content/50">
                {formatCommentDate(comment.createdAt || new Date())}
              </TextSmall>
            )}

            {canDelete && (
              <Button
                onClick={() => onDelete && onDelete(comment._id)}
                variant="btn-error btn-outline"
                size="btn-xs px-2!"
              >
                <SvgTrash />
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
      </div>
    </div>
  );
};

export default BoardCommentItem;
