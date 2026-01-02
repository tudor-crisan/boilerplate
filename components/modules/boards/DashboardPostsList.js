"use client";
import { useState, useEffect } from "react";
import ItemDisplay from "@/components/list/ItemDisplay";
import ButtonDelete from "@/components/button/ButtonDelete";
import toast from "react-hot-toast";
import Title from "@/components/common/Title";
import { getClientId } from "@/libs/utils.client";

const DashboardPostsList = ({ posts, boardId }) => {
  const [postsState, setPostsState] = useState(posts);

  useEffect(() => {
    setPostsState(posts);
  }, [posts]);

  const handleVote = (postId, newVoteCount) => {
    setPostsState((prevPosts) => {
      const updatedPosts = prevPosts.map((post) => {
        if (post._id === postId) {
          return { ...post, votesCounter: newVoteCount };
        }
        return post;
      });

      return updatedPosts.sort((a, b) => {
        if (b.votesCounter !== a.votesCounter) {
          return (b.votesCounter || 0) - (a.votesCounter || 0);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    });
  };

  useEffect(() => {
    const eventSource = new EventSource("/api/modules/boards/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "vote" && data.boardId === boardId) {
          handleVote(data.postId, data.votesCounter);
        }

        if (data.type === "post-create" && data.boardId === boardId) {
          setPostsState((prevPosts) => {
            if (prevPosts.some(p => p._id === data.post._id)) return prevPosts;

            const newPosts = [data.post, ...prevPosts];
            return newPosts.sort((a, b) => {
              if (b.votesCounter !== a.votesCounter) {
                return (b.votesCounter || 0) - (a.votesCounter || 0);
              }
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
          });

          if (data.clientId !== getClientId()) {
            toast.success("New post added!");
          }
        }

        if (data.type === "post-delete" && data.boardId === boardId) {
          setPostsState((prevPosts) => prevPosts.filter(p => p._id !== data.postId));
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
  }, [boardId]);

  return (
    <div className="space-y-4 w-full">
      <Title>Posts ({postsState?.length || 0})</Title>
      <ItemDisplay

        items={postsState}
        itemAction={(item) => (
          <ButtonDelete
            url={`/api/modules/boards/post?postId=${item._id}`}
            buttonText="Delete"
            withConfirm={true}
            confirmMessage="Are you sure you want to delete this post?"
            refreshOnSuccess={false} // SSE will handle the update
          />
        )}
      />
    </div>
  );
};

export default DashboardPostsList;
