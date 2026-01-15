import { useState } from 'react';
import clsx from 'clsx';
import { formatCommentDate } from "@/libs/utils.client";
import TextSmall from "@/components/common/TextSmall";
import Button from '@/components/button/Button';

export default function BoardNotificationItem({ notification, loadingIds, markAsRead, styling }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const content = notification.type === 'POST' ? notification.data?.postTitle :
    notification.type === 'COMMENT' ? notification.data?.commentText :
      notification.data?.postTitle;

  const isContentLong = content && content.length > 70; // Threshold for truncation

  return (
    <div className={clsx(`${styling.components.element} ${styling.flex.between} alert opacity-70 items-start`, (!notification.isRead || loadingIds.includes(notification._id)) && "border-primary alert-outline opacity-100")}>
      <div className="flex-1 space-y-1 pt-1 min-w-0">
        <div className="flex items-center gap-2">
          <TextSmall>
            {formatCommentDate(notification.createdAt)}
          </TextSmall>
          <span className="badge badge-xs badge-primary font-bold">{notification.type}</span>
        </div>

        <div className="text-sm">
          <span className="font-bold mr-2">[{notification.boardId?.name || 'Board'}]</span>
          <span className={clsx("opacity-80 wrap-break-words", !isExpanded && "line-clamp-1 inline")}>
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
      </div>
      {(!notification.isRead || loadingIds.includes(notification._id)) && (
        <Button
          onClick={() => markAsRead([notification._id])}
          variant="btn-outline"
          size="btn-xs"
          className="shrink-0 ml-2 mt-1"
          isLoading={loadingIds.includes(notification._id)}
          disabled={notification.isRead}
        >
          Mark Read
        </Button>
      )}
    </div>
  );
}
