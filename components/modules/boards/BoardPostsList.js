"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { defaultSetting as settings } from "@/libs/defaults";
import EmptyState from "@/components/common/EmptyState";
import SvgPost from "@/components/svg/SvgPost";
import ItemDisplay from "@/components/list/ItemDisplay";
import BoardButtonVote from "@/components/modules/boards/BoardUpvoteButton";
import useBoardPosts from "@/hooks/modules/boards/useBoardPosts";

const BoardPostsList = ({ posts, boardId, emptyStateConfig = {} }) => {
  const { posts: postsState, handleVote, isBoardDeleted } = useBoardPosts(boardId, posts, { showVoteToast: true });
  const router = useRouter();

  useEffect(() => {
    if (isBoardDeleted) {
      toast.error("This board has been deleted and will be inactive.");

      const timer = setTimeout(() => {
        router.push(settings.paths.home.source);
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [isBoardDeleted, router]);

  return (
    <div className="w-full min-w-0 relative">
      {isBoardDeleted && (
        <div className="fixed inset-0 z-50 bg-base-100/50 cursor-not-allowed user-select-none" />
      )}
      {(!postsState || postsState.length === 0) ? (
        <EmptyState
          title={emptyStateConfig?.title}
          description={emptyStateConfig?.description}
          icon={<SvgPost size="size-16" />}
        />
      ) : (
        <ItemDisplay
          items={postsState}
          itemAction={
            (item) => (
              <BoardButtonVote
                postId={item._id}
                initialVotesCounter={item.votesCounter || 0}
                onVote={(newCount) => handleVote(item._id, newCount)}
              />
            )}
        />
      )}

    </div>
  );
};

export default BoardPostsList;
