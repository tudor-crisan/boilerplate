"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useStyling } from "@/context/ContextStyling";
import Title from "@/components/common/Title";
import TextSmall from "@/components/common/TextSmall";

export default function DashboardAnalyticsSummary() {
  const { styling } = useStyling();
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
    <div className={`${styling.components.card} p-5`}>
      <div className="flex justify-between items-center mb-4">
        <Title>Analytics</Title>
        <Link href="/dashboard/analytics" className="text-xs font-bold opacity-70 hover:opacity-100">View All</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="flex flex-col bg-base-200/30 p-4 rounded-xl">
          <TextSmall className="mb-1">Views</TextSmall>
          <div className="text-2xl font-extrabold text-primary">{totals.views}</div>
        </div>
        <div className="flex flex-col bg-base-200/30 p-4 rounded-xl">
          <TextSmall className="mb-1">Posts</TextSmall>
          <div className="text-2xl font-extrabold text-secondary">{totals.posts}</div>
        </div>
        <div className="flex flex-col bg-base-200/30 p-4 rounded-xl">
          <TextSmall className="mb-1">Votes</TextSmall>
          <div className="text-2xl font-extrabold">{totals.votes}</div>
        </div>
        <div className="flex flex-col bg-base-200/30 p-4 rounded-xl">
          <TextSmall className="mb-1">Comments</TextSmall>
          <div className="text-2xl font-extrabold">{totals.comments}</div>
        </div>
      </div>
    </div>
  );
}
