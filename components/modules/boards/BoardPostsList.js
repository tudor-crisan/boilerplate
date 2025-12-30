"use client";

import { useState, useEffect } from "react";
import ItemDisplay from "@/components/list/ItemDisplay";
import BoardButtonVote from "@/components/modules/boards/BoardUpvoteButton";
import toast from "react-hot-toast";

const BoardPostsList = ({ posts, boardId }) => {
  const [postsState, setPostsState] = useState(posts);

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

  // Real-time updates with SSE
  useEffect(() => {
    const eventSource = new EventSource("/api/modules/boards/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "vote" && data.boardId === boardId) {
          handleVote(data.postId, data.votesCounter);
          toast.success("Board updated!");
        }
      } catch (error) {
        console.error("SSE parse error", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [boardId]);

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
