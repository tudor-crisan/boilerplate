"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useStyling } from "@/context/ContextStyling";
import Title from "@/components/common/Title";
import TextSmall from "@/components/common/TextSmall";
import Button from '@/components/button/Button';
import Grid from '@/components/common/Grid';
import Flex from '@/components/common/Flex';

const DashboardAnalyticsItem = ({ text = '', className = '', count = '' }) => {
  const { styling } = useStyling();
  return (
    <Flex className={`${styling.components.card} ${styling.general.box} ${styling.flex.col_center}`}>
      <TextSmall>{text}</TextSmall>
      <Title className={className}>{count}</Title>
    </Flex>
  )
}

export default function DashboardAnalytics() {
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
    <div className={`${styling.components.card} ${styling.general.box} space-y-3`}>
      <div className={`${styling.flex.between}`}>
        <Title>Analytics</Title>
        <Button href="/dashboard/analytics">View All</Button>
      </div>
      <Grid className="gap-4 grid-cols-2 sm:grid-cols-4">
        <DashboardAnalyticsItem text="Views" className="text-primary" count={totals.views} />
        <DashboardAnalyticsItem text="Posts" className="text-secondary" count={totals.posts} />
        <DashboardAnalyticsItem text="Votes" count={totals.votes} />
        <DashboardAnalyticsItem text="Comments" count={totals.comments} />
      </Grid>
    </div>
  );
}
