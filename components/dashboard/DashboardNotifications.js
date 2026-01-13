"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';

export default function DashboardNotifications() {
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

  if (notifications.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-base-content">Recent Notifications</h2>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {notifications.map(n => (
            <div key={n._id} className={clsx("alert p-2 flex flex-row items-center", !n.isRead && "alert-info")}>
              <div className="flex-1 text-sm">
                <span className="font-bold mr-2">[{n.boardId?.name || 'Board'}]</span>
                <span className="badge badge-sm mr-2">{n.type}</span>
                <span className="opacity-80">
                  {n.type === 'POST' ? n.data?.postTitle :
                    n.type === 'COMMENT' ? n.data?.commentText :
                      n.data?.postTitle}
                </span>
              </div>
              {!n.isRead && (
                <button onClick={() => markAsRead([n._id])} className="btn btn-xs btn-ghost">Mark Read</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
