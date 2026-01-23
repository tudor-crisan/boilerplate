import CardNotification from "@/components/card/CardNotification";
import { formattedDate } from "@/libs/utils.client";

export default function BoardNotificationItem({
  notification,
  loadingIds,
  markAsRead,
}) {
  // Logic to determine content
  const content =
    notification.type === "POST"
      ? notification.data?.postTitle
      : notification.type === "COMMENT"
        ? notification.data?.commentText
        : notification.data?.postTitle;

  return (
    <CardNotification
      isRead={notification.isRead}
      isLoading={loadingIds.includes(notification._id)}
      onMarkRead={() => markAsRead([notification._id])}
      dateFormatted={formattedDate(notification.createdAt)}
      badge={notification.type}
      title={`[${notification.boardId?.name || notification.data?.boardName || "Board"}]`}
      content={content}
      className={
        !notification.isRead || loadingIds.includes(notification._id)
          ? "border-primary alert-outline opacity-100"
          : ""
      }
    />
  );
}
