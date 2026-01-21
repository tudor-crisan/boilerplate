"use client";
import Button from "@/components/button/Button";
import InfiniteScroll from "@/components/common/InfiniteScroll";
import Loading from "@/components/common/Loading";
import TextSmall from "@/components/common/TextSmall";
import Title from "@/components/common/Title";
import BoardNotificationItem from "@/components/modules/boards/dashboard/NotificationItem";
import { useStyling } from "@/context/ContextStyling";
import useBoardNotifications from "@/hooks/modules/boards/useBoardNotifications";
import React from "react";

export default function BoardDashboardNotifications() {
  const { styling } = useStyling();

  const {
    notifications,
    loadingInitial,
    isFetching,
    hasMore,
    loadingIds,
    isMarkingAll,
    markAsRead,
    markAllRead,
    loadMore,
  } = useBoardNotifications();

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  if (loadingInitial && notifications.length === 0) {
    return (
      <div
        className={`${styling.components.card} ${styling.general.box} space-y-3`}
      >
        <Title>Recent Notifications</Title>
        <Loading text="Loading notifications ..." />
      </div>
    );
  }

  return (
    <div
      className={`${styling.components.card} ${styling.general.box} space-y-3`}
    >
      <div className={`${styling.flex.between}`}>
        <Title>Recent Notifications</Title>
        {(unreadCount > 0 || isMarkingAll) && (
          <Button
            onClick={markAllRead}
            variant="btn-outline"
            size="btn-xs"
            isLoading={isMarkingAll}
          >
            Mark all as read
          </Button>
        )}
      </div>
      <InfiniteScroll
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isFetching}
        className="max-h-60 overflow-y-auto space-y-2"
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <BoardNotificationItem
              key={notification._id}
              notification={notification}
              loadingIds={loadingIds}
              markAsRead={markAsRead}
              styling={styling}
            />
          ))
        ) : (
          <TextSmall className="overflow-hidden">
            No recent notifications yet. When someone votes, comments, or posts,
            they will appear here.
          </TextSmall>
        )}
        {isFetching && hasMore && (
          <Loading text="Loading notifications ..." className="mt-2" />
        )}
      </InfiniteScroll>
    </div>
  );
}
