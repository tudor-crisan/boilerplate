"use client";

import ItemDisplay from "@/components/list/ItemDisplay";
import BoardButtonVote from "@/components/modules/boards/BoardButtonVote";

const BoardPostsList = ({ posts }) => {
  return (
    <ItemDisplay
      items={posts}
      itemAction={(item) => (
        <BoardButtonVote
          postId={item._id}
          initialVotesCounter={item.votesCounter || 0}
        />
      )}
    />
  );
};

export default BoardPostsList;
