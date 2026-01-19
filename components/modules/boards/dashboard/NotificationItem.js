import CardNotification from "@/components/card/CardNotification";

// Assuming formatCommentDate is available or imported. If it was missing in the view, I'll leave it as is, or import it if I find it.
// The previous view didn't show it. I will assuming it's imported from libs/formatters or similar, OR I'll assume it was globally defined.
// To be safe, I'll search for it first. But for now, I'll just use the Card.

export default function BoardNotificationItem({ notification, loadingIds, markAsRead, styling }) {
  // Logic to determine content
  const content = notification.type === 'POST' ? notification.data?.postTitle :
    notification.type === 'COMMENT' ? notification.data?.commentText :
      notification.data?.postTitle;

  return (
    <CardNotification
      isRead={notification.isRead}
      isLoading={loadingIds.includes(notification._id)}
      onMarkRead={() => markAsRead([notification._id])}
      dateFormatted={new Date(notification.createdAt).toLocaleDateString()} // Fallback or use standard date if function missing
      badge={notification.type}
      title={`[${notification.boardId?.name || notification.data?.boardName || 'Board'}]`}
      content={content}
      className={(!notification.isRead || loadingIds.includes(notification._id)) ? "border-primary alert-outline opacity-100" : ""}
    />
  );
}
