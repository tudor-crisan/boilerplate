"use client";

import EmptyState from "@/components/common/EmptyState";
import SvgPost from "@/components/svg/SvgPost";
import ItemDisplay from "@/components/list/ItemDisplay";
import BoardButtonVote from "@/components/modules/boards/BoardUpvoteButton";
import useBoardPosts from "@/hooks/modules/boards/useBoardPosts";

const BoardPostsList = ({ posts, boardId }) => {
  const { posts: postsState, handleVote } = useBoardPosts(boardId, posts, { showVoteToast: true });

  if (!postsState || postsState.length === 0) {
    return (
      <EmptyState
        title="Be the first to post"
        description="Create a new post to see it here"
        icon={<SvgPost size="size-16" />}
      />
    );
  }

  return (
    <div className="w-full min-w-0">
      <ItemDisplay
        items={postsState}
        itemAction={(item) => (
          <BoardButtonVote
            postId={item._id}
            initialVotesCounter={item.votesCounter || 0}
            onVote={(newCount) => handleVote(item._id, newCount)}
          />
        )}
      />
    </div>
  );
};

export default BoardPostsList;
