"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BoardAnalyticsWidget({ boardId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`/api/modules/analytics/board?boardId=${boardId}`)
      .then(res => setData(res.data.stats || []))
      .catch(err => console.error(err));
  }, [boardId]);

  if (!data) return <div className="flex justify-center p-4"><span className="loading loading-spinner text-primary"></span></div>;

  // Calculate totals from data (array of daily stats)
  const totals = data.reduce((acc, curr) => ({
    views: acc.views + (curr.views || 0),
    posts: acc.posts + (curr.posts || 0),
    votes: acc.votes + (curr.votes || 0),
    comments: acc.comments + (curr.comments || 0),
  }), { views: 0, posts: 0, votes: 0, comments: 0 });

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 w-full">
        <div className="stat">
          <div className="stat-title">Views (30d)</div>
          <div className="stat-value text-primary text-2xl">{totals.views}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Posts</div>
          <div className="stat-value text-secondary text-2xl">{totals.posts}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Votes</div>
          <div className="stat-value text-2xl">{totals.votes}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Comments</div>
          <div className="stat-value text-2xl">{totals.comments}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-4">
          <h3 className="card-title text-sm opacity-70">Activity Trend</h3>
          <div className="flex items-end space-x-1 h-32 pt-4 w-full">
            {data.length > 0 ? data.map((day, i) => {
              const total = (day.views || 0) + (day.posts || 0) + (day.votes || 0) + (day.comments || 0);
              const max = Math.max(...data.map(d => (d.views || 0) + (d.posts || 0) + (d.votes || 0) + (d.comments || 0))) || 1;
              const height = Math.max((total / max) * 100, 5);
              return (
                <div key={i} className="flex-1 flex flex-col justify-end group relative">
                  <div className="tooltip tooltip-primary w-full h-full flex items-end" data-tip={`${new Date(day.date).toLocaleDateString()}: ${total}`}>
                    <div className="bg-primary opacity-60 hover:opacity-100 transition-all rounded-t w-full" style={{ height: `${height}%` }}></div>
                  </div>
                </div>
              );
            }) : <div className="text-center w-full opacity-50 text-sm py-8">No activity recorded yet</div>}
          </div>
          <div className="flex justify-between text-[10px] opacity-50 uppercase font-bold">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
