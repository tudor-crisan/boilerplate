"use client";
import React, { useRef } from 'react';
import { useStyling } from "@/context/ContextStyling";
import Title from "@/components/common/Title";
import TextSmall from "@/components/common/TextSmall";
import Button from '@/components/button/Button';
import IconLoading from "@/components/icon/IconLoading";
import Paragraph from "@/components/common/Paragraph";
import useBoardNotifications from '@/hooks/modules/boards/useBoardNotifications';
import BoardNotificationItem from './BoardNotificationItem';

export default function BoardDashboardNotifications() {
  const { styling } = useStyling();
  const scrollContainerRef = useRef(null);

  const {
    notifications,
    loadingInitial,
    isFetching,
    hasMore,
    loadingIds,
    isMarkingAll,
    markAsRead,
    markAllRead,
    loadMore
  } = useBoardNotifications();

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 30) {
      loadMore();
    }
  };

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  if (loadingInitial && notifications.length === 0) {
    return (
      <div className={`${styling.components.card} ${styling.general.box} space-y-3`}>
        <Title>Recent Notifications</Title>
        <Paragraph className={`${styling.flex.start} gap-2 opacity-60`}>
          <IconLoading /> Loading notifications ...
        </Paragraph>
      </div>
    );
  }

  return (
    <div className={`${styling.components.card} ${styling.general.box} space-y-3`}>
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
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="max-h-60 overflow-y-auto space-y-2"
      >
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <BoardNotificationItem
              key={notification._id}
              notification={notification}
              loadingIds={loadingIds}
              markAsRead={markAsRead}
              styling={styling}
            />
          ))
        ) : (
          <TextSmall className="overflow-hidden">No recent notifications yet. When someone votes, comments, or posts, they will appear here.</TextSmall>
        )}
        {isFetching && hasMore && (
          <Paragraph className={`${styling.flex.start} gap-2 opacity-60 py-4`}>
            <IconLoading /> Loading notifications ...
          </Paragraph>
        )}
      </div>
    </div>
  );
}
