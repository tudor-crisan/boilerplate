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
import Button from '@/components/button/Button';
import Paragraph from '@/components/common/Paragraph';

export default function DashboardNotifications() {
  const { styling } = useStyling();
  const [notifications, setNotifications] = useState([]);
  const { request } = useApiRequest();

  const fetchNotifications = () => {
    request(() => clientApi.get(settings.paths.api.boardsNotifications), {
      onSuccess: (msg, data) => setNotifications(data.notifications || []),
      showToast: false
    });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = (ids) => {
    request(() => clientApi.put(settings.paths.api.boardsNotifications, { notificationIds: ids }), {
      onSuccess: () => fetchNotifications(),
      showToast: false
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`${styling.components.card} ${styling.general.box} space-y-3`}>
      <div className={`${styling.flex.between}`}>
        <Title>Recent Notifications</Title>
        {unreadCount > 0 && (
          <Button
            onClick={markAllRead}
            variant="btn-outline"
            size="btn-xs"
          >
            Mark all as read
          </Button>
        )}
      </div>
      <div className="max-h-60 overflow-y-auto space-y-2">
        {notifications.map(n => (
          <div key={n._id} className={clsx(`${styling.components.element} ${styling.flex.between} alert opacity-70`, n.isRead && "alert-outline alert-success opacity-100")}>
            <div className="flex-1 space-y-1 pt-1">
              <TextSmall>
                {formatCommentDate(n.createdAt)}
              </TextSmall>
              <Paragraph>
                <span className="badge badge-xs badge-primary font-bold mr-2">{n.type}</span>
                <span className="font-bold mr-2">[{n.boardId?.name || 'Board'}  ]</span>
                <span className="opacity-80">
                  {
                    n.type === 'POST' ? n.data?.postTitle :
                      n.type === 'COMMENT' ? n.data?.commentText :
                        n.data?.postTitle
                  }
                </span>
              </Paragraph>
            </div>
            {!n.isRead && (
              <Button
                onClick={() => markAsRead([n._id])}
                variant="btn-outline"
                size="btn-xs"
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
