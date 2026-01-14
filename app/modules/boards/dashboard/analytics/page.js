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

export default function AnalyticsPage() {
  const { styling } = useStyling();
  const [data, setData] = useState(null);
  const { range, setRange, ranges, startLabel, endLabel } = useAnalyticsRange();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    clientApi.get(settings.paths.api.analyticsGlobal, { params: { range } })
      .then(res => setData(res.data.data))
      .catch(err => console.error("Error fetching analytics:", err))
      .finally(() => setIsLoading(false));
  }, [range]);

  // Dynamic Styling from Context
  const cardClass = `${styling.components.card} p-6 h-full`;
  const selectClass = styling.components.select;
  const titleClass = styling.section.title;
  const roundingClass = styling.components.element.split(' ').find(c => c.startsWith('rounded')) || 'rounded-none';
  const barRounding = roundingClass.replace('rounded', 'rounded-t');
  const tooltipRounding = `before:${roundingClass}`;

  return (
    <DashboardWrapper>
      <DashboardHeader>
        <div className="w-full flex justify-between items-center gap-4">
          <ButtonBack url="/dashboard" />

          <div className="w-full sm:w-auto">
            <select
              className={selectClass}
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              {ranges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
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
                            <div className={`tooltip tooltip-primary w-full h-full flex items-end ${tooltipRounding}`} data-tip={`${new Date(day._id).toLocaleDateString()}: ${total} events`}>
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
                        <th><TextSmall className="font-bold">Board Name</TextSmall></th>
                        <th><TextSmall className="font-bold">Views</TextSmall></th>
                        <th><TextSmall className="font-bold">Posts</TextSmall></th>
                        <th><TextSmall className="font-bold">Votes</TextSmall></th>
                        <th><TextSmall className="font-bold">Comments</TextSmall></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.boards && data.boards.length > 0 ? data.boards.map(board => (
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
