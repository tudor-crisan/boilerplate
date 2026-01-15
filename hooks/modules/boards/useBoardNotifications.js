import { useState, useRef, useEffect, useCallback } from 'react';
import { defaultSetting as settings } from "@/libs/defaults";
import useApiRequest from '@/hooks/useApiRequest';
import { clientApi } from '@/libs/api';
import { setDataError, setDataSuccess } from "@/libs/api";

export default function useBoardNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const { request: fetchReq, loading: isFetching } = useApiRequest();
  const [loadingIds, setLoadingIds] = useState([]);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const prevLoadingIdsRef = useRef(loadingIds);

  const fetchNotifications = useCallback((pageNumber = 1) => {
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

  // Initial fetch
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
        if (event.data === ": keep-alive") return;

        const data = JSON.parse(event.data);
        console.log("SSE message received:", data.type);

        if (data.type === "notification-create") {
          setNotifications(prev => {
            if (prev.some(n => n._id === data.notification._id)) return prev;
            return [data.notification, ...prev];
          });
          window.dispatchEvent(new CustomEvent('analytics-refresh'));
        }

        if (data.type === "notification-update") {
          setNotifications(prev => prev.map(n => {
            if (n._id === data.notificationId && data.updatedFields) {
              return { ...n, ...data.updatedFields };
            }
            return n;
          }));
          window.dispatchEvent(new CustomEvent('analytics-refresh'));
        }

      } catch (error) {
        console.error("SSE parse error", error);
      }
    };

    eventSource.onerror = (error) => {
      console.log("SSE connection interrupted, waiting for auto-reconnect...");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Debounced fetch logic (kept as is for behavior consistency)
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

    // Optimistic Update
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

  const markAllRead = () => {
    const unreadIds = notifications.filter(notification => !notification.isRead).map(notification => notification._id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  };

  const loadMore = () => {
      if (!isFetching && hasMore) {
          fetchNotifications(page + 1);
      }
  }

  return {
    notifications,
    loadingInitial,
    isFetching,
    hasMore,
    loadingIds,
    isMarkingAll,
    markAsRead,
    markAllRead,
    loadMore
  };
}
