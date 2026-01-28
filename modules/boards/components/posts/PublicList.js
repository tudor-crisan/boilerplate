"use client";

import EmptyState from "@/components/common/EmptyState";
import SvgPost from "@/components/svg/SvgPost";
import SvgSearch from "@/components/svg/SvgSearch";
import { clientApi } from "@/libs/api";
import { defaultSetting as settings } from "@/libs/defaults";
import { toast } from "@/libs/toast";
import BoardPostItem from "@/modules/boards/components/posts/PostItem";
import BoardButtonVote from "@/modules/boards/components/ui/UpvoteButton";
import useBoardFiltering from "@/modules/boards/hooks/useBoardFiltering";
import useBoardPosts from "@/modules/boards/hooks/useBoardPosts";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

const BoardPublicPostsList = ({
  posts,
  boardId,
  emptyStateConfig = {},
  commentSettings,
  search = "",
  sort = "votes_desc",
}) => {
  const {
    posts: postsState,
    handleVote,
    isBoardDeleted,
  } = useBoardPosts(boardId, posts, { showVoteToast: true });
  const router = useRouter();

  const { filteredPosts } = useBoardFiltering(postsState, { search, sort });

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
      clientApi
        .post(settings.paths.api.analyticsVisit, { boardId })
        .catch((err) => console.error(err));
    }
  }, [boardId]);

  const emptyStateTitle =
    emptyStateConfig?.title || settings.defaultExtraSettings.emptyState.title;

  const emptyStateDescription =
    emptyStateConfig?.description ||
    settings.defaultExtraSettings.emptyState.description;

  return (
    <div className="w-full min-w-0 relative">
      {isBoardDeleted && (
        <div className="fixed inset-0 z-50 bg-base-100/50 cursor-not-allowed user-select-none" />
      )}
      {!filteredPosts || filteredPosts.length === 0 ? (
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
                search={search}
                boardSettings={commentSettings}
                itemAction={(item) => (
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
    </div>
  );
};

export default BoardPublicPostsList;
