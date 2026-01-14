"use client";
import React, { useEffect, useState } from 'react';
import { clientApi } from '@/libs/api';
import { defaultSetting as settings } from "@/libs/defaults";
import { useStyling } from "@/context/ContextStyling";
import Label from "@/components/common/Label";
import TextSmall from "@/components/common/TextSmall";
import IconLoading from "@/components/icon/IconLoading";
import { useAnalyticsRange } from "@/hooks/modules/boards/useAnalyticsRange";
import Paragraph from '@/components/common/Paragraph';

export default function BoardAnalyticsWidget({ boardId }) {
  const { styling } = useStyling();
  const [data, setData] = useState(null);
  const { range, setRange, ranges, startLabel, endLabel } = useAnalyticsRange();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    clientApi.get(settings.paths.api.analyticsBoard, { params: { boardId, range } })
      .then(res => setData(res.data.stats || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [boardId, range]);

  // Calculate totals from data
  const totals = (data || []).reduce((acc, curr) => ({
    views: acc.views + (curr.views || 0),
    posts: acc.posts + (curr.posts || 0),
    votes: acc.votes + (curr.votes || 0),
    comments: acc.comments + (curr.comments || 0),
  }), { views: 0, posts: 0, votes: 0, comments: 0 });

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center sm:hidden">
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
        <Paragraph className={`${styling.flex.start} gap-2 mt-2`}>
          <IconLoading /> Loading analytics...
        </Paragraph>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className={`${styling.components.card} p-3 flex flex-col justify-center items-center text-center bg-base-100`}>
              <TextSmall className="mb-1">Views</TextSmall>
              <span className="text-xl font-bold text-primary leading-none">{totals.views}</span>
            </div>
            <div className={`${styling.components.card} p-3 flex flex-col justify-center items-center text-center bg-base-100`}>
              <TextSmall className="mb-1">Posts</TextSmall>
              <span className="text-xl font-bold text-secondary leading-none">{totals.posts}</span>
            </div>
            <div className={`${styling.components.card} p-3 flex flex-col justify-center items-center text-center bg-base-100`}>
              <TextSmall className="mb-1">Votes</TextSmall>
              <span className="text-xl font-bold leading-none">{totals.votes}</span>
            </div>
            <div className={`${styling.components.card} p-3 flex flex-col justify-center items-center text-center bg-base-100`}>
              <TextSmall className="mb-1">Comments</TextSmall>
              <span className="text-xl font-bold leading-none">{totals.comments}</span>
            </div>
          </div>

          <div className={`${styling.components.card} p-3`}>
            <TextSmall className="font-bold mb-2">Activity Trend</TextSmall>
            <div className="flex items-end space-x-1 h-16 w-full">
              {data && data.length > 0 ? data.map((day, i) => {
                const total = (day.views || 0) + (day.posts || 0) + (day.votes || 0) + (day.comments || 0);
                const max = Math.max(1, ...data.map(d => (d.views || 0) + (d.posts || 0) + (d.votes || 0) + (d.comments || 0)));
                const height = (total / max) * 100;
                return (
                  <div key={i} className="flex-1 h-full flex flex-col justify-end group relative">
                    <div className="tooltip tooltip-left w-full h-full flex items-end" data-tip={`${new Date(day.date).toLocaleDateString()}: ${total}`}>
                      <div className="bg-primary opacity-60 hover:opacity-100 transition-all rounded-t w-full" style={{ height: `${Math.max(height, 5)}%` }}></div>
                    </div>
                  </div>
                );
              }) : (
                <div className="w-full h-full flex items-center justify-center opacity-30">
                  <TextSmall className="uppercase font-bold">No Data</TextSmall>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-2">
              <TextSmall className="opacity-40 uppercase font-bold">{startLabel}</TextSmall>
              <TextSmall className="opacity-40 uppercase font-bold">{endLabel}</TextSmall>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
