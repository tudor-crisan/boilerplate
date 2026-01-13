"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { defaultSetting as settings } from "@/libs/defaults";
import EmptyState from "@/components/common/EmptyState";
import SvgPost from "@/components/svg/SvgPost";
import SvgSearch from "@/components/svg/SvgSearch";
import BoardPostItem from "@/components/modules/boards/BoardPostItem";
import { AnimatePresence } from "framer-motion";
import BoardButtonVote from "@/components/modules/boards/BoardUpvoteButton";
import useBoardPosts from "@/hooks/modules/boards/useBoardPosts";

const BoardPublicPostsList = ({ posts, boardId, emptyStateConfig = {}, commentSettings, search = "", sort = "votes_desc" }) => {
  const { posts: postsState, handleVote, isBoardDeleted } = useBoardPosts(boardId, posts, { showVoteToast: true });
  const router = useRouter();

  const filteredPosts = [...(postsState || [])]
    .filter(post => {
      if (!search) return true;
      const term = search.toLowerCase();
      return (
        post.title?.toLowerCase().includes(term) ||
        post.description?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      switch (sort) {
        case "votes_desc":
          return (b.votesCounter || 0) - (a.votesCounter || 0);
        case "date_desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date_asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "comments_desc":
          return (b.commentsCount || 0) - (a.commentsCount || 0);
        default:
          return 0;
      }
    });

  useEffect(() => {
    if (isBoardDeleted) {
      toast.error("This board has been deleted and will be inactive.");

      const timer = setTimeout(() => {
        router.push(settings.paths.home.source);
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [isBoardDeleted, router]);

  useEffect(() => {
    // Track visit
    if (boardId) {
      axios.post('/api/modules/analytics/visit', { boardId })
        .catch(err => console.error(err));
    }
  }, [boardId]);

  const emptyStateTitle = emptyStateConfig?.title || settings.defaultExtraSettings.emptyState.title;
  const emptyStateDescription = emptyStateConfig?.description || settings.defaultExtraSettings.emptyState.description;

  return (
    <div className="w-full min-w-0 relative">
      {isBoardDeleted && (
        <div className="fixed inset-0 z-50 bg-base-100/50 cursor-not-allowed user-select-none" />
      )}
      {(!filteredPosts || filteredPosts.length === 0) ? (
        search ? (
          <EmptyState
            title="No posts found"
            description="There are no posts for your search"
            icon={<SvgSearch size="size-16" />}
          />
        ) : (
          <EmptyState
            title={emptyStateTitle}
            description={emptyStateDescription}
            icon={<SvgPost size="size-16" />}
          />
        )
      ) : (
        <ul className="space-y-4 grow">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((item) => (
              <BoardPostItem
                key={item._id}
                item={item}
                boardSettings={commentSettings}
                itemAction={
                  (item) => (
                    <BoardButtonVote
                      postId={item._id}
                      initialVotesCounter={item.votesCounter || 0}
                      onVote={(newCount) => handleVote(item._id, newCount)}
                    />
                  )}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}

    </div >
  );
};

export default BoardPublicPostsList;
