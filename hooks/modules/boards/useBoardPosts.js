"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { getClientId } from "@/libs/utils.client";
import { defaultSetting as settings } from "@/libs/defaults";

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
  const [posts, setPosts] = useState(sortPosts(initialPosts));
  const [isBoardDeleted, setIsBoardDeleted] = useState(false);
  const isBoardDeletedRef = useRef(false);

  // Sync state if initialProps change
  useEffect(() => {
    setPosts(sortPosts(initialPosts));
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

    const eventSource = new EventSource(settings.paths.api.boardsStream);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Only process events for this board (except delete, which might lack boardId)
        if (data.type !== "post-delete" && data.boardId !== boardId) {
          return;
        }

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

            return sortPosts([...prevPosts, data.post]);
          });

          if (data.clientId !== getClientId()) {
            toast.success("New post added!");
          }
        }

        if (data.type === "post-delete") {
          setPosts((prevPosts) => prevPosts.filter(p => p._id !== data.postId));

          if (!isBoardDeletedRef.current) {
            toast.success("Post removed!");
          }
        }

        if (data.type === "comment-update" && data.boardId === boardId) {
          setPosts((prevPosts) => {
            return prevPosts.map(post => {
              if (post._id === data.postId) {
                return {
                  ...post,
                  commentsCount: Math.max(0, (post.commentsCount || 0) + (data.action === "add" ? 1 : -1))
                };
              }
              return post;
            });
          });

          // Show toast if the action wasn't performed by this client
          // Note: clientId for comments might need to be sent from server if we want to filter own actions
          // For now, simpler to just show it or better: don't show toast for comments to avoid spam?
          // User asked for "with toast notification" presumably.
          // Let's add it but try to filter? 
          // We aren't sending clientId in comment-update event currently.
          // Let's rely on the fact that if it works, they see the number change.
          // If the user SPECIFICALLY asked for toast, I should add it.
          // "it did not appear ... with toast notification". This implies they WANT toast.
          // Or they saw one but item didn't update.
          // I will add a generic toast.
          if (showVoteToast) {
            toast.success(data.action === "add" ? "New comment!" : "Comment deleted!");
          }
        }

        if (data.type === "board-delete" && data.boardId === boardId) {
          setIsBoardDeleted(true);
          isBoardDeletedRef.current = true;
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
    handleVote,
    isBoardDeleted
  };
};

export default useBoardPosts;
