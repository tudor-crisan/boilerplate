"use client";

import SearchableList from "@/modules/general/components/list/SearchableList";

export default function BoardDashboardList({
  initialBoards = [],
  type = "Board",
}) {
  return <SearchableList items={initialBoards} type={type} filterKey="name" />;
}
