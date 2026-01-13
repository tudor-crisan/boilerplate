"use client";

import { useState } from "react";
import { useStyling } from "@/context/ContextStyling";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import Button from "@/components/button/Button";
import BoardCommentSection from "@/components/modules/boards/BoardCommentSection";
import SvgComment from "@/components/svg/SvgComment";

const BoardPostItem = ({ item, itemAction }) => {
  const { styling } = useStyling();
  const [showComments, setShowComments] = useState(false);

  return (
    <li
      className={`${styling.components.card} ${styling.general.box} block`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-1 min-w-0 flex-1">
          <Title className="wrap-break-word line-clamp-2">{item.title}</Title>
        </div>

        <div className="ml-6 shrink-0 flex items-center gap-2">
          <Button
            onClick={() => setShowComments(!showComments)}
            className="btn-ghost btn-sm opacity-70 hover:opacity-100 gap-1.5 px-2"
          >
            <SvgComment size="size-5" />
            <span className="text-xs font-normal">{item.commentsCount || 0}</span>
          </Button>

          {(itemAction || item.action) && (
            <div>
              {typeof itemAction === "function" ? itemAction(item) : item.action}
            </div>
          )}
        </div>
      </div>

      <Paragraph className="max-h-32 wrap-break-word">
        {item.description}
      </Paragraph>

      {showComments && (
        <BoardCommentSection postId={item._id} />
      )}
    </li>
  );
};

export default BoardPostItem;
