"use client";
import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { useStyling } from "@/context/ContextStyling";
import { formatCommentDate } from "@/libs/utils.client";
import Title from "@/components/common/Title";
import TextSmall from "@/components/common/TextSmall";
import { defaultSetting as settings } from "@/libs/defaults";
import useApiRequest from '@/hooks/useApiRequest';
import { clientApi } from '@/libs/api';
import { setDataError, setDataSuccess } from "@/libs/api";
import Button from '@/components/button/Button';
import IconLoading from "@/components/icon/IconLoading";
import Paragraph from "@/components/common/Paragraph";

export default function BoardDashboardNotifications() {
  const { styling } = useStyling();
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const { request: fetchReq, loading: isFetching } = useApiRequest();
  // Removed actionReq to allow concurrent requests
  const [loadingIds, setLoadingIds] = useState([]);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const prevLoadingIdsRef = useRef(loadingIds);
  const scrollContainerRef = useRef(null);

  const fetchNotifications = React.useCallback((pageNumber = 1) => {
    fetchReq(() => clientApi.get(`${settings.paths.api.boardsNotifications}?page=${pageNumber}&limit=20`), {
      onSuccess: (msg, data) => {
        setNotifications(prev => {
          if (pageNumber === 1) return data.notifications || [];
          const newNotifications = data.notifications || [];
          const existingIds = new Set(prev.map(n => n._id));
          const filteredNew = newNotifications.filter(n => !existingIds.has(n._id));
          return [...prev, ...filteredNew];
        });
        setHasMore(data.hasMore);
        setPage(pageNumber);
        if (pageNumber === 1) setLoadingInitial(false);
      },
      showToast: false
    });
  }, [fetchReq]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Realtime Updates via SSE
  useEffect(() => {
    const eventSource = new EventSource(settings.paths.api.notificationsStream);

    eventSource.onopen = () => {
      console.log("SSE connection established");
    };

    eventSource.onmessage = (event) => {
      try {
        // Handle keep-alive
        if (event.data === ": keep-alive") return;

        const data = JSON.parse(event.data);
        console.log("SSE message received:", data.type);

        if (data.type === "notification-create") {
          setNotifications(prev => {
            // Avoid duplicates
            if (prev.some(n => n._id === data.notification._id)) return prev;
            return [data.notification, ...prev];
          });
          // Trigger analytics refresh
          window.dispatchEvent(new CustomEvent('analytics-refresh'));
        }

        if (data.type === "notification-update") {
          setNotifications(prev => prev.map(n => {
            if (n._id === data.notificationId && data.updatedFields) {
              return { ...n, ...data.updatedFields };
            }
            return n;
          }));
          // Trigger analytics refresh
          window.dispatchEvent(new CustomEvent('analytics-refresh'));
        }

      } catch (error) {
        console.error("SSE parse error", error);
      }
    };

    eventSource.onerror = (error) => {
      // Vercel serverless functions will close the connection.
      // The browser's EventSource will automatically attempt to reconnect.
      console.log("SSE connection interrupted, waiting for auto-reconnect...");
    };

    return () => {
      eventSource.close();
    };
  }, []); // Empty dependency array to run once on mount

  // Debounced fetch: Only fetch when all concurrent requests are finished
  useEffect(() => {
    const prevIds = prevLoadingIdsRef.current;
    if (prevIds.length > 0 && loadingIds.length === 0) {
      fetchNotifications();
    }
    prevLoadingIdsRef.current = loadingIds;
  }, [loadingIds, fetchNotifications]);

  const markAsRead = async (ids) => {
    setLoadingIds(prev => [...new Set([...prev, ...ids])]);
    if (ids.length > 1) {
      setIsMarkingAll(true);
    }

    // Optimistic Update: Immediately mark selected notifications as read in local state
    setNotifications(prev => prev.map(notification =>
      ids.includes(notification._id) ? { ...notification, isRead: true } : notification
    ));

    try {
      const res = await clientApi.put(settings.paths.api.boardsNotifications, { notificationIds: ids });

      const onCompletion = () => {
        setLoadingIds(prev => prev.filter(id => !ids.includes(id)));
        setIsMarkingAll(false);
      }

      if (setDataSuccess(res, onCompletion)) return;
      if (setDataError(res, onCompletion)) return;

    } catch (error) {
      console.error(error);
      setLoadingIds(prev => prev.filter(id => !ids.includes(id)));
      setIsMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  const markAllRead = () => {
    const unreadIds = notifications.filter(notification => !notification.isRead).map(notification => notification._id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  };

  const handleScroll = (e) => {
    if (isFetching || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 30) {
      fetchNotifications(page + 1);
    }
  };

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
            <NotificationItem
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

const NotificationItem = ({ notification, loadingIds, markAsRead, styling }) => {
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
