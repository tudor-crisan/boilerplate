
import React from 'react';
import TextSmall from "@/components/common/TextSmall";

export default function BoardAnalyticsChart({ data, styling, startLabel, endLabel }) {

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
    <div className={`${styling.components.card} p-3`}>
      <TextSmall className="font-bold mb-2">Activity Trend</TextSmall>
      <div className="flex items-end justify-center space-x-1 h-16 w-full">
        {data && data.length > 0 ? data.map((day, i) => {
          const total = (day.views || 0) + (day.posts || 0) + (day.votes || 0) + (day.comments || 0);
          const max = Math.max(1, ...data.map(d => (d.views || 0) + (d.posts || 0) + (d.votes || 0) + (d.comments || 0)));
          const height = (total / max) * 100;
          return (
            <div key={i} className="flex-1 max-w-8 h-full flex flex-col justify-end group relative">
              <div
                className="tooltip tooltip-left w-full h-full flex items-end"
                data-tip={`${new Date(day.date).toLocaleDateString()}: ${total}`}
                style={{ '--tooltip-radius': tooltipRadius }}
              >
                <div className={`bg-primary opacity-60 hover:opacity-100 transition-all ${barRounding} w-full`} style={{ height: `${Math.max(height, 5)}%` }}></div>
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
  );
}
