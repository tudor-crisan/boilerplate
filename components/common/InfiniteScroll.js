"use client";
import React, { useRef } from 'react';

const InfiniteScroll = ({
  children,
  onLoadMore,
  hasMore,
  isLoading,
  className = "",
  threshold = 30 // distance from bottom to trigger load
}) => {
  const scrollContainerRef = useRef(null);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // Check if we are close to the bottom
    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      if (hasMore && !isLoading) {
        onLoadMore();
      }
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className={className}
    >
      {children}
    </div>
  );
};

export default InfiniteScroll;
