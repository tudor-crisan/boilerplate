"use client";

import { useState } from "react";
import { useStyling } from "@/context/ContextStyling";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import { motion } from "framer-motion";
import Button from "@/components/button/Button";
import Tooltip from "@/components/common/Tooltip";
import BoardCommentSection from "./BoardCommentSection";
import SvgComment from "@/components/svg/SvgComment";

const BoardPostItem = ({ item, itemAction }) => {
  const { styling } = useStyling();
  const [showComments, setShowComments] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className={`${styling.components.card} ${styling.general.box} block`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1 min-w-0 flex-1">
          <Title className="wrap-break-word">{item.title}</Title>
          <Paragraph className="max-h-32 wrap-break-word">
            {item.description}
          </Paragraph>

        </div>

        <div className="ml-6 shrink-0 flex items-center gap-2">
          <Tooltip text={showComments ? "Hide Comments" : "Comments"} isVisible={isTooltipVisible}>
            <div
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
            >
              <Button
                onClick={() => setShowComments(!showComments)}
                className="btn-ghost btn-sm opacity-70 hover:opacity-100 gap-1.5 px-2"
              >
                <SvgComment size="w-5 h-5" />
                {item.commentsCount > 0 && (
                  <span className="text-xs font-normal">{item.commentsCount}</span>
                )}
              </Button>
            </div>
          </Tooltip>

          {(itemAction || item.action) && (
            <div>
              {typeof itemAction === "function" ? itemAction(item) : item.action}
            </div>
          )}
        </div>
      </div>

      {showComments && (
        <BoardCommentSection postId={item._id} />
      )}
    </motion.li>
  );
};

export default BoardPostItem;
