"use client";

import ItemDisplay from "@/components/list/ItemDisplay";
import BoardButtonVote from "@/components/modules/boards/BoardUpvoteButton";
import useBoardPosts from "@/hooks/modules/boards/useBoardPosts";

const BoardPostsList = ({ posts, boardId }) => {
  const { posts: postsState, handleVote } = useBoardPosts(boardId, posts, { showVoteToast: true });

  return (
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
  );
};

export default BoardPostsList;
