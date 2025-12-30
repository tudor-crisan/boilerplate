"use client";

import { useState, useEffect } from "react";
import ItemDisplay from "@/components/list/ItemDisplay";
import BoardButtonVote from "@/components/modules/boards/BoardUpvoteButton";
import { getPosts } from "@/libs/modules/boards/actions";

const BoardPostsList = ({ posts, boardId }) => {
  const [postsState, setPostsState] = useState(posts);

  // Poll for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const posts = await getPosts(boardId);

        if (posts) {
          setPostsState(posts);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [boardId]);


  const handleVote = (postId, newVoteCount) => {
    setPostsState((prevPosts) => {
      // 1. Update the specific post
      const updatedPosts = prevPosts.map((post) => {
        if (post._id === postId) {
          return { ...post, votesCounter: newVoteCount };
        }
        return post;
      });

      // 2. Sort the array
      // Primary sort: votesCounter (desc)
      // Secondary sort: createdAt (desc)
      return updatedPosts.sort((a, b) => {
        if (b.votesCounter !== a.votesCounter) {
          return b.votesCounter - a.votesCounter;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    });
  };

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
