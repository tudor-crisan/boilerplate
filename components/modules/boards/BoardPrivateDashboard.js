"use client";
import { useState } from "react";
import BoardPrivatePostsList from "./BoardPrivatePostsList";
import BoardAnalyticsWidget from "./BoardAnalyticsWidget";
import clsx from "clsx";

export default function BoardPrivateDashboard({ posts, boardId }) {
  const [tab, setTab] = useState("posts");

  return (
    <div className="space-y-6">
      <div role="tablist" className="tabs tabs-boxed">
        <a role="tab" className={clsx("tab", tab === "posts" && "tab-active")} onClick={() => setTab("posts")}>Posts</a>
        <a role="tab" className={clsx("tab", tab === "analytics" && "tab-active")} onClick={() => setTab("analytics")}>Analytics</a>
      </div>

      {tab === "posts" ? (
        <BoardPrivatePostsList posts={posts} boardId={boardId} />
      ) : (
        <BoardAnalyticsWidget boardId={boardId} />
      )}
    </div>
  );
}
