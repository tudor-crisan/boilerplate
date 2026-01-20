"use client";
import AnalyticsStats from '@/components/analytics/AnalyticsStats';
import Button from '@/components/button/Button';
import Title from "@/components/common/Title";
import { useStyling } from "@/context/ContextStyling";
import useApiRequest from '@/hooks/useApiRequest';
import { clientApi } from '@/libs/api';
import { defaultSetting as settings } from "@/libs/defaults";
import React, { useEffect, useState } from 'react';


export default function BoardDashboardAnalytics() {
  const { styling } = useStyling();
  const [data, setData] = useState(null);
  const { request } = useApiRequest();

  const fetchAnalytics = React.useCallback((showLoading = true) => {
    if (showLoading) setData(null); // Show skeleton

    request(() => clientApi.get(settings.paths.api.analyticsGlobal), {
      onSuccess: (msg, res) => setData(res),
      showToast: false,
    });
  }, [request]);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(() => fetchAnalytics(false), 30000); // Poll every 30 seconds

    // Reactive refresh when notifications arrive
    const handleRefresh = () => fetchAnalytics(false);
    window.addEventListener('analytics-refresh', handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('analytics-refresh', handleRefresh);
    };
  }, [fetchAnalytics]);

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
        <Button href={settings.paths.dashboardAnalytics.source}>View All</Button>
      </div>
      <AnalyticsStats
        items={[
          { label: "Views", value: totals.views, color: "text-primary" },
          { label: "Posts", value: totals.posts, color: "text-secondary" },
          { label: "Votes", value: totals.votes },
          { label: "Comments", value: totals.comments },
        ]}
        styling={styling}
      />
    </div>
  );
}
