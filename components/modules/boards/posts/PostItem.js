"use client";

import Button from "@/components/button/Button";
import CardPost from "@/components/card/CardPost";
import BoardCommentSection from "@/components/modules/boards/ui/CommentSection";
import SvgComment from "@/components/svg/SvgComment";
import { useState } from "react";

const BoardPostItem = ({ item, itemAction, boardSettings }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <li className="block">
      <CardPost
        title={item.title}
        description={item.description}
        onClick={() => { }}
        actions={
          <>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
              className="btn-ghost btn-sm opacity-70 hover:opacity-100 gap-1.5 px-2"
            >
              <SvgComment size="size-5" />
              <span className="text-xs font-normal">{item.commentsCount || 0}</span>
            </Button>

            {(itemAction || item.action) && (
              <div onClick={(e) => e.stopPropagation()}>
                {typeof itemAction === "function" ? itemAction(item) : item.action}
              </div>
            )}
          </>
        }
      >
        {showComments && (
          <BoardCommentSection postId={item._id} settings={boardSettings} />
        )}
      </CardPost>
    </li >
  );
};

export default BoardPostItem;
