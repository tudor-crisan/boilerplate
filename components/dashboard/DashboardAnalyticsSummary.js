"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function DashboardAnalyticsSummary() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/modules/analytics/global')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div className="skeleton h-24 w-full"></div>;

  // Calculate global totals
  const totals = (data.boards || []).reduce((acc, board) => ({
    views: acc.views + (board.totalViews || 0),
    posts: acc.posts + (board.totalPosts || 0),
    votes: acc.votes + (board.totalVotes || 0),
    comments: acc.comments + (board.totalComments || 0),
  }), { views: 0, posts: 0, votes: 0, comments: 0 });

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title text-base-content">Overview</h2>
          <Link href="/dashboard/analytics" className="btn btn-sm btn-ghost">View All</Link>
        </div>
        <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200 w-full overflow-hidden">
          <div className="stat">
            <div className="stat-title">Views</div>
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
      </div>
    </div>
  );
}
