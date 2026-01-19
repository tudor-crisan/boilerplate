
"use client";
import React, { useEffect, useState } from 'react';
import { clientApi } from '@/libs/api';
import { defaultSetting as settings } from "@/libs/defaults";
import { useStyling } from "@/context/ContextStyling";
import Label from "@/components/common/Label";
import { useAnalyticsRange } from "@/hooks/useAnalyticsRange";
import AnalyticsStats from '@/components/analytics/AnalyticsStats';
import AnalyticsChart from '@/components/analytics/AnalyticsChart';
import Loading from '@/components/common/Loading';

export default function BoardAnalyticsWidget({ boardId }) {
  const { styling } = useStyling();
  const [data, setData] = useState(null);
  const { range, setRange, ranges, startLabel, endLabel } = useAnalyticsRange();
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = React.useCallback((showLoading = true) => {
    if (showLoading) setIsLoading(true);
    clientApi.get(settings.paths.api.analyticsBoard, { params: { boardId, range } })
      .then(res => setData(res.data.stats || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [boardId, range]);

  useEffect(() => {
    fetchAnalytics();

    const handleRefresh = () => fetchAnalytics(false);
    window.addEventListener('analytics-refresh', handleRefresh);

    return () => {
      window.removeEventListener('analytics-refresh', handleRefresh);
    };
  }, [fetchAnalytics]);

  // Calculate totals from data
  const totals = (data || []).reduce((acc, curr) => ({
    views: acc.views + (curr.views || 0),
    posts: acc.posts + (curr.posts || 0),
    votes: acc.votes + (curr.votes || 0),
    comments: acc.comments + (curr.comments || 0),
  }), { views: 0, posts: 0, votes: 0, comments: 0 });

  const statsItems = [
    { label: "Views", value: totals.views, color: "text-primary" },
    { label: "Posts", value: totals.posts, color: "text-secondary" },
    { label: "Votes", value: totals.votes },
    { label: "Comments", value: totals.comments },
  ];

  return (
    <div className="space-y-4 w-full">
      <div className={`${styling.flex.between} sm:hidden`}>
        <Label className="opacity-70">Analytics</Label>
      </div>

      <select
        className={`${styling.components.select} w-full select-sm text-xs`}
        value={range}
        onChange={(e) => setRange(e.target.value)}
      >
        {ranges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
      </select>

      {isLoading ? (
        <Loading text="Loading analytics ..." />
      ) : (
        <>
          <AnalyticsStats items={statsItems} styling={styling} />

          <AnalyticsChart
            data={data}
            styling={styling}
            startLabel={startLabel}
            endLabel={endLabel}
            title="Activity Trend"
            getValue={(item) => (item.views || 0) + (item.posts || 0) + (item.votes || 0) + (item.comments || 0)}
          />
        </>
      )}
    </div>
  );
}
