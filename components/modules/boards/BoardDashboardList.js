"use client";

import { useState } from "react";
import ListDisplay from "@/components/list/ListDisplay";
import BoardFilterBar from "@/components/modules/boards/BoardFilterBar";

export default function BoardDashboardList({ initialBoards = [], type = "Board" }) {
  const [search, setSearch] = useState("");

  const filteredBoards = initialBoards.filter((board) =>
    board.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <ListDisplay
        type={type}
        list={filteredBoards}
      >
        {initialBoards.length > 0 && (
          <BoardFilterBar
            search={search}
            setSearch={setSearch}
            placeholder={`Search ${type.toLowerCase()}s...`}
          />
        )}
      </ListDisplay>
    </div>
  );
}
