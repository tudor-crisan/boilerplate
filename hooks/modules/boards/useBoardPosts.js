"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getClientId } from "@/libs/utils.client";

/**
 * Common sorting function for board posts
 * Primary sort: votesCounter (desc)
 * Secondary sort: createdAt (desc)
 */
const sortPosts = (posts) => {
  return [...posts].sort((a, b) => {
    if (b.votesCounter !== a.votesCounter) {
      return (b.votesCounter || 0) - (a.votesCounter || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

/**
 * Hook to manage board posts state and real-time updates via SSE
 * 
 * @param {string} boardId - The ID of the board
 * @param {Array} initialPosts - Initial list of posts
 * @param {Object} options - Configuration options
 * @param {boolean} options.showVoteToast - Whether to show a toast message when someone votes
 */
export const useBoardPosts = (boardId, initialPosts, { showVoteToast = false } = {}) => {
  const [posts, setPosts] = useState(initialPosts);

  // Sync state if initialProps change
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleVote = useCallback((postId, newVoteCount) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((post) => {
        if (post._id === postId) {
          return { ...post, votesCounter: newVoteCount };
        }
        return post;
      });
      return sortPosts(updatedPosts);
    });
  }, []);

  useEffect(() => {
    if (!boardId) return;

    const eventSource = new EventSource("/api/modules/boards/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Only process events for this board
        if (data.boardId !== boardId) return;

        if (data.type === "vote") {
          handleVote(data.postId, data.votesCounter);
          if (showVoteToast && data.clientId !== getClientId()) {
            toast.success("Board updated!");
          }
        }

        if (data.type === "post-create") {
          setPosts((prevPosts) => {
            // Avoid duplicates
            if (prevPosts.some(p => p._id === data.post._id)) return prevPosts;

            const newPosts = [data.post, ...prevPosts];
            return sortPosts(newPosts);
          });

          if (data.clientId !== getClientId()) {
            toast.success("New post added!");
          }
        }

        if (data.type === "post-delete") {
          setPosts((prevPosts) => prevPosts.filter(p => p._id !== data.postId));
          toast.success("Post removed!");
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
  }, [boardId, handleVote, showVoteToast]);

  return {
    posts,
    setPosts,
    handleVote
  };
};

export default useBoardPosts;
