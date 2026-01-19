"use client";

import SearchableList from "@/components/list/SearchableList";

export default function BoardDashboardList({ initialBoards = [], type = "Board" }) {
  return (
    <SearchableList
      items={initialBoards}
      type={type}
      filterKey="name"
    />
  );
}
