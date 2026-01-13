"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { useStyling } from "@/context/ContextStyling";
import { formatCommentDate } from "@/libs/utils.client";
import Title from "@/components/common/Title";
import TextSmall from "@/components/common/TextSmall";

export default function DashboardNotifications() {
  const { styling } = useStyling();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = () => {
    axios.get('/api/modules/notifications')
      .then(res => setNotifications(res.data.notifications || []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = (ids) => {
    axios.put('/api/modules/notifications', { notificationIds: ids })
      .then(() => fetchNotifications())
      .catch(err => console.error(err));
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
    <div className={`${styling.components.card} p-5`}>
      <div className="flex justify-between items-center mb-4">
        <Title>Recent Notifications</Title>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn btn-xs btn-ghost text-xs font-normal opacity-60 hover:opacity-100">
            Mark all as read
          </button>
        )}
      </div>
      <div className="max-h-60 overflow-y-auto space-y-2">
        {notifications.map(n => (
          <div key={n._id} className={clsx("alert px-4 py-2 flex flex-row items-center opacity-70", !n.isRead && "alert-outline opacity-100")}>
            <div className="flex-1 text-sm">
              <div>
                <span className="font-bold mr-2">[{n.boardId?.name || 'Board'}]</span>
                <span className="badge badge-xs mr-2">{n.type}</span>
                <span className="opacity-80">
                  {n.type === 'POST' ? n.data?.postTitle :
                    n.type === 'COMMENT' ? n.data?.commentText :
                      n.data?.postTitle}
                </span>
              </div>
              <TextSmall className="mt-1">
                {formatCommentDate(n.createdAt)}
              </TextSmall>
            </div>
            {!n.isRead && (
              <button onClick={() => markAsRead([n._id])} className="btn btn-xs btn-ghost">Mark Read</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
