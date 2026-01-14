"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMain from "@/components/dashboard/DashboardMain";
import ButtonBack from "@/components/button/ButtonBack";
import SvgSearch from '@/components/svg/SvgSearch';
import { useStyling } from "@/context/ContextStyling";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import TextSmall from "@/components/common/TextSmall";

const ranges = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
  { label: "This Year", value: "thisYear" },
  { label: "Last Year", value: "lastYear" },
];

export default function AnalyticsPage() {
  const { styling } = useStyling();
  const [data, setData] = useState(null);
  const [range, setRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`/api/modules/analytics/global?range=${range}`)
      .then(res => setData(res.data.data))
      .catch(err => console.error("Error fetching analytics:", err))
      .finally(() => setIsLoading(false));
  }, [range]);

  const getRangeLabel = () => {
    switch (range) {
      case 'today': return ['Today', 'Now'];
      case 'yesterday': return ['Yesterday', 'End of day'];
      case '7d': return ['7 days ago', 'Today'];
      case '30d': return ['30 days ago', 'Today'];
      case '3m': return ['3 months ago', 'Today'];
      case 'thisYear': return ['Jan 1', 'Today'];
      case 'lastYear': return ['Jan 1', 'Dec 31'];
      default: return ['Start', 'End'];
    }
  };

  const [startLabel, endLabel] = getRangeLabel();

  // Dynamic Styling from Context
  const cardClass = `${styling.components.card} p-6 h-full`;
  const selectClass = styling.components.select;
  const titleClass = styling.section.title;

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
            <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg"></span></div>
          ) : (
            <>
              {/* Timeline Visualization */}
              <div className={cardClass}>
                <Title className="mb-4">Activity Trend</Title>

                {data?.timeline && data.timeline.length > 0 ? (
                  <div className="w-full">
                    <div className="flex items-end space-x-1 h-64 pt-4 w-full">
                      {data.timeline.map((day, i) => {
                        const total = (day.views || 0) + (day.posts || 0) + (day.votes || 0) + (day.comments || 0);
                        const maxVal = Math.max(...data.timeline.map(t => (t.views || 0) + (t.posts || 0) + (t.votes || 0) + (t.comments || 0))) || 1;
                        const height = Math.max((total / maxVal) * 100, 2);

                        return (
                          <div key={i} className="flex-1 flex flex-col justify-end group relative">
                            <div className="tooltip tooltip-primary w-full h-full flex items-end" data-tip={`${new Date(day._id).toLocaleDateString()}: ${total} events`}>
                              <div className="bg-primary opacity-70 hover:opacity-100 transition-all rounded-t w-full" style={{ height: `${height}%` }}></div>
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
                    <SvgSearch className="size-12 mb-2" />
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
