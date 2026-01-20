import CardNotification from "@/components/card/CardNotification";



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
