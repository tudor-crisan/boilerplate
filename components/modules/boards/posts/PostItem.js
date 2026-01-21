"use client";

import Button from "@/components/button/Button";
import CardPost from "@/components/card/CardPost";
import BoardCommentSection from "@/components/modules/boards/ui/CommentSection";
import SvgComment from "@/components/svg/SvgComment";
import useHighlight from "@/hooks/useHighlight";
import { useMemo, useState } from "react";

const BoardPostItem = ({ item, itemAction, boardSettings, search }) => {
  const [showComments, setShowComments] = useState(false);
  const { HighlightedText, escapeRegExp } = useHighlight();

  const commentMatches = useMemo(() => {
    if (!search || !item.comments) return [];

    const matches = [];
    const textToCheck = item.comments.map((c) => c.text).join(" ");
    const regex = new RegExp(escapeRegExp(search), "gi");

    let match;
    // Limit to 3 matches from comments to avoid clutter
    let count = 0;
    while ((match = regex.exec(textToCheck)) !== null && count < 3) {
      const start = Math.max(0, match.index - 30);
      const end = Math.min(
        textToCheck.length,
        match.index + search.length + 30,
      );
      let snippet = textToCheck.substring(start, end);

      if (start > 0) snippet = "..." + snippet;
      if (end < textToCheck.length) snippet = snippet + "...";

      matches.push(snippet);
      count++;
    }
    return matches;
  }, [item.comments, search, escapeRegExp]);

  const showCommentsEnabled = boardSettings?.isEnabled !== false;

  return (
    <li className="block">
      <CardPost
        title={<HighlightedText text={item.title} highlight={search} />}
        description={
          <HighlightedText text={item.description} highlight={search} />
        }
        onClick={() => {}}
        actions={
          <>
            {showCommentsEnabled && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComments(!showComments);
                }}
                className="btn-ghost btn-sm opacity-70 hover:opacity-100 gap-1.5 px-2"
              >
                <SvgComment size="size-5" />
                <span className="text-xs font-normal">
                  {item.commentsCount || 0}
                </span>
              </Button>
            )}

            {(itemAction || item.action) && (
              <div onClick={(e) => e.stopPropagation()}>
                {typeof itemAction === "function"
                  ? itemAction(item)
                  : item.action}
              </div>
            )}
          </>
        }
      >
        {commentMatches.length > 0 && (
          <div className="mt-4 pt-4 border-t border-base-content/10 w-full text-xs text-base-content/70 italic">
            <div className="mb-1 not-italic font-medium text-base-content/50">
              Found in comments:
            </div>
            {commentMatches.map((match, idx) => (
              <div key={idx} className="mb-1">
                &quot;
                <HighlightedText text={match} highlight={search} />
                &quot;
              </div>
            ))}
          </div>
        )}

        {showCommentsEnabled && showComments && (
          <BoardCommentSection postId={item._id} settings={boardSettings} />
        )}
      </CardPost>
    </li>
  );
};

export default BoardPostItem;
