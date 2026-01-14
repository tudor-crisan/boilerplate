"use client";
import { useState } from 'react';

export const ranges = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
  { label: "This Year", value: "thisYear" },
  { label: "Last Year", value: "lastYear" },
];

export function useAnalyticsRange(initialRange = "30d") {
  const [range, setRange] = useState(initialRange);

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

  return {
    range,
    setRange,
    ranges,
    startLabel,
    endLabel
  };
}
