"use client";
import React, { useEffect, useState } from 'react';
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
import Paragraph from '@/components/common/Paragraph';

export default function BoardDashboardNotifications() {
  const { styling } = useStyling();
  const [notifications, setNotifications] = useState([]);
  const { request: fetchReq } = useApiRequest();
  // Removed actionReq to allow concurrent requests
  const [loadingIds, setLoadingIds] = useState([]);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const prevLoadingIdsRef = React.useRef(loadingIds);

  const fetchNotifications = React.useCallback(() => {
    fetchReq(() => clientApi.get(settings.paths.api.boardsNotifications), {
      onSuccess: (msg, data) => setNotifications(data.notifications || []),
      showToast: false
    });
  }, [fetchReq]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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

  if (notifications.length === 0) return null;

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
      <div className="max-h-60 overflow-y-auto space-y-2">
        {notifications.map(notification => (
          <div key={notification._id} className={clsx(`${styling.components.element} ${styling.flex.between} alert opacity-70`, (!notification.isRead || loadingIds.includes(notification._id)) && "border-primary alert-outline opacity-100")}>
            <div className="flex-1 space-y-1 pt-1 min-w-0">
              <TextSmall>
                {formatCommentDate(notification.createdAt)}
              </TextSmall>
              <Paragraph className="truncate overflow-hidden">
                <span className="badge badge-xs badge-primary font-bold mr-2">{notification.type}</span>
                <span className="font-bold mr-2">[{notification.boardId?.name || 'Board'}  ]</span>
                <span className="opacity-80">
                  {
                    notification.type === 'POST' ? notification.data?.postTitle :
                      notification.type === 'COMMENT' ? notification.data?.commentText :
                        notification.data?.postTitle
                  }
                </span>
              </Paragraph>
            </div>
            {(!notification.isRead || loadingIds.includes(notification._id)) && (
              <Button
                onClick={() => markAsRead([notification._id])}
                variant="btn-outline"
                size="btn-xs"
                className="shrink-0 ml-2"
                isLoading={loadingIds.includes(notification._id)}
                disabled={notification.isRead} // Disable if already optimistically read
              >
                Mark Read
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
