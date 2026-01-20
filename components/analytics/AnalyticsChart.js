import TextSmall from "@/components/common/TextSmall";
import React from 'react';

export default function AnalyticsChart({
  data,
  styling,
  startLabel,
  endLabel,
  title = "Activity Trend",
  getValue = (item) => item.value || 0,
  tooltipFormat = (item, val) => `${new Date(item.date).toLocaleDateString()}: ${val}`
}) {

  const roundingClass = styling?.components?.element?.split(' ').find(c => c.startsWith('rounded')) || 'rounded-none';
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
    <div className={`${styling?.components?.card || "bg-base-100 rounded-box"} p-3`}>
      <TextSmall className="font-bold mb-2">{title}</TextSmall>
      <div className="flex items-end justify-center space-x-1 h-16 w-full">
        {data && data.length > 0 ? data.map((day, i) => {
          const total = getValue(day);
          const max = Math.max(1, ...data.map(d => getValue(d)));
          const height = (total / max) * 100;
          return (
            <div key={i} className={`flex-1 max-w-8 h-full ${styling?.flex?.col || "flex flex-col"} justify-end group relative`}>
              <div
                className="tooltip tooltip-left w-full h-full flex items-end"
                data-tip={tooltipFormat(day, total)}
                style={{ '--tooltip-radius': tooltipRadius }}
              >
                <div className={`bg-primary opacity-60 hover:opacity-100 transition-all ${barRounding} w-full`} style={{ height: `${Math.max(height, 5)}%` }}></div>
              </div>
            </div>
          );
        }) : (
          <div className={`w-full h-full ${styling?.flex?.center || "flex items-center justify-center"} opacity-30`}>
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
