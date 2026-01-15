
import React from 'react';
import TextSmall from "@/components/common/TextSmall";

export default function BoardAnalyticsStats({ totals, styling }) {
  if (!totals) return null;

  return (
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
  );
}
