"use client";
import React, { useEffect, useState } from 'react';
import { clientApi } from '@/libs/api';
import { defaultSetting as settings } from "@/libs/defaults";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMain from "@/components/dashboard/DashboardMain";
import ButtonBack from "@/components/button/ButtonBack";
import { useStyling } from "@/context/ContextStyling";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import TextSmall from "@/components/common/TextSmall";
import { useAnalyticsRange } from "@/hooks/modules/boards/useAnalyticsRange";
import IconLoading from "@/components/icon/IconLoading";
import Select from "@/components/select/Select";
import { useSort } from "@/hooks/useSort";

export default function AnalyticsPage() {
  const { styling } = useStyling();
  const [data, setData] = useState(null);
  const { range, setRange, ranges, startLabel, endLabel } = useAnalyticsRange();
  const [isLoading, setIsLoading] = useState(true);

  const { sortedItems: sortedBoards, requestSort, getSortIcon } = useSort(data?.boards, { key: 'totalViews', direction: 'desc' });

  useEffect(() => {
    const fetchData = (showLoading = true) => {
      if (showLoading) {
        setIsLoading(true);
        setData(null);
      }

      clientApi.get(settings.paths.api.analyticsGlobal, { params: { range } })
        .then(res => setData(res.data.data))
        .catch(err => console.error("Error fetching analytics:", err))
        .finally(() => setIsLoading(false));
    };

    fetchData();

    // Poll every 30 seconds (don't show full loading spinner for background updates)
    const intervalId = setInterval(() => fetchData(false), 30000);

    // Reactive refresh when notifications arrive (triggered in BoardDashboardNotifications)
    const handleRefresh = () => fetchData(false);
    window.addEventListener('analytics-refresh', handleRefresh);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('analytics-refresh', handleRefresh);
    };
  }, [range]);

  // Dynamic Styling from Context
  const cardClass = `${styling.components.card} ${styling.general.box}`;
  const titleClass = styling.section.title;
  const roundingClass = styling.components.element.split(' ').find(c => c.startsWith('rounded')) || 'rounded-none';
  const barRounding = roundingClass.replace('rounded', '!rounded-t');

  const getRadiusValue = (cls) => {
    const map = {
      'rounded-none': '0px',
      'rounded-sm': '0.125rem',
      'rounded-md': '0.375rem',
      'rounded-lg': '0.5rem',
      'rounded-xl': '0.75rem',
      'rounded-2xl': '1rem',
      'rounded-3xl': '1.5rem',
      'rounded-full': '9999px'
    };
    return map[cls] || '0.25rem';
  };
  const tooltipRadius = getRadiusValue(roundingClass);

  return (
    <DashboardWrapper>
      <DashboardHeader>
        <div className="w-full flex justify-between items-center gap-4">
          <ButtonBack url="/dashboard" />

          <div className="w-fit">
            <Select
              className="pr-10! w-full sm:w-48"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              options={ranges}
            />
          </div>
        </div>
      </DashboardHeader>

      <DashboardMain>
        <div className="space-y-6 w-full">
          <div className="flex flex-col gap-2">
            <Title className={titleClass}>Analytics</Title>
          </div>

          {isLoading ? (
            <Paragraph className={`${styling.flex.start} gap-2`}>
              <IconLoading /> Loading analytics...
            </Paragraph>
          ) : (
            <>
              {/* Timeline Visualization */}
              <div className={cardClass}>
                <Title className="mb-4">Activity Trend</Title>

                {data?.timeline && data.timeline.length > 0 ? (
                  <div className="w-full">
                    <div className="flex items-end justify-center space-x-1 h-64 pt-4 w-full">
                      {data.timeline.map((day, i) => {
                        const total = (day.views || 0) + (day.posts || 0) + (day.votes || 0) + (day.comments || 0);
                        const maxVal = Math.max(1, ...data.timeline.map(t => (t.views || 0) + (t.posts || 0) + (t.votes || 0) + (t.comments || 0)));
                        const height = (total / maxVal) * 100;

                        return (
                          <div key={i} className="flex-1 max-w-[40px] h-full flex flex-col justify-end group relative">
                            <div
                              className="tooltip tooltip-primary w-full h-full flex items-end"
                              data-tip={`${new Date(day._id).toLocaleDateString()}: ${total} events`}
                              style={{ '--tooltip-radius': tooltipRadius }}
                            >
                              <div className={`bg-primary opacity-70 hover:opacity-100 transition-all ${barRounding} w-full`} style={{ height: `${Math.max(height, 2)}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-2">
                      <TextSmall>{startLabel}</TextSmall>
                      <TextSmall>{endLabel}</TextSmall>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center text-center opacity-60">
                    <Paragraph>No activity found for this period</Paragraph>
                  </div>
                )}
              </div>

              {/* Boards Table */}
              <div className={cardClass}>
                <Title className="mb-4">Board Performance</Title>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="cursor-pointer hover:bg-base-200 transition-colors" onClick={() => requestSort('name')}>
                          <div className="flex items-center gap-2">
                            <TextSmall className="font-bold">Board Name</TextSmall>
                            {getSortIcon('name')}
                          </div>
                        </th>
                        <th className="cursor-pointer hover:bg-base-200 transition-colors" onClick={() => requestSort('totalViews')}>
                          <div className="flex items-center gap-2">
                            <TextSmall className="font-bold">Views</TextSmall>
                            {getSortIcon('totalViews')}
                          </div>
                        </th>
                        <th className="cursor-pointer hover:bg-base-200 transition-colors" onClick={() => requestSort('totalPosts')}>
                          <div className="flex items-center gap-2">
                            <TextSmall className="font-bold">Posts</TextSmall>
                            {getSortIcon('totalPosts')}
                          </div>
                        </th>
                        <th className="cursor-pointer hover:bg-base-200 transition-colors" onClick={() => requestSort('totalVotes')}>
                          <div className="flex items-center gap-2">
                            <TextSmall className="font-bold">Votes</TextSmall>
                            {getSortIcon('totalVotes')}
                          </div>
                        </th>
                        <th className="cursor-pointer hover:bg-base-200 transition-colors" onClick={() => requestSort('totalComments')}>
                          <div className="flex items-center gap-2">
                            <TextSmall className="font-bold">Comments</TextSmall>
                            {getSortIcon('totalComments')}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedBoards.length > 0 ? sortedBoards.map(board => (
                        <tr key={board._id}>
                          <td className="font-bold">{board.name}</td>
                          <td>{board.totalViews || 0}</td>
                          <td>{board.totalPosts || 0}</td>
                          <td>{board.totalVotes || 0}</td>
                          <td>{board.totalComments || 0}</td>
                        </tr>
                      )) : <tr><td colSpan="5" className="text-center py-4"><Paragraph>No boards found</Paragraph></td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </DashboardMain>
    </DashboardWrapper>
  );
}
