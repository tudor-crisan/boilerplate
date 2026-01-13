"use client";
import { useStyling } from "@/context/ContextStyling";
import EmptyState from "@/components/common/EmptyState";
import SvgPost from "@/components/svg/SvgPost";
import SvgSearch from "@/components/svg/SvgSearch";
import ButtonDelete from "@/components/button/ButtonDelete";
import TextSmall from "@/components/common/TextSmall";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import useBoardPosts from "@/hooks/modules/boards/useBoardPosts";
import { defaultSetting as settings } from "@/libs/defaults";
import { formatCommentDate } from "@/libs/utils.client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import BoardFilterBar from "@/components/modules/boards/BoardFilterBar";

const BoardPrivatePostsList = ({ posts, boardId }) => {
  const { styling } = useStyling();
  const { posts: postsState } = useBoardPosts(boardId, posts);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("votes_desc");

  const sortOptions = [
    { label: "Top Voted", value: "votes_desc" },
    { label: "Newest", value: "date_desc" },
    { label: "Oldest", value: "date_asc" },
    { label: "Most Comments", value: "comments_desc" },
  ];

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

  return (
    <div className="space-y-4 w-full min-w-0">
      <Title>Posts ({filteredPosts?.length || 0})</Title>

      {postsState?.length > 0 && (
        <BoardFilterBar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          sortOptions={sortOptions}
        />
      )}

      {filteredPosts?.length > 0 ? (
        <ul className="space-y-4 grow">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((item) => (
              <motion.li
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className={`${styling.components.card} ${styling.general.box} block`}
              >


                <div className="space-y-1 mb-4">
                  <Title className="wrap-break-word line-clamp-2 mb-4">{item.title}</Title>
                  <Paragraph className="max-h-32 wrap-break-word">
                    {item.description}
                  </Paragraph>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col space-y-2">
                    <TextSmall className="text-base-content/50">
                      {formatCommentDate(item.createdAt)}
                    </TextSmall>
                    <TextSmall>
                      {item.votesCounter || 0} votes • {item.commentsCount || 0} comments
                    </TextSmall>
                  </div>

                  <ButtonDelete
                    url={`${settings.paths.api.boardsPost}?postId=${item._id}`}
                    buttonText="Delete"
                    withConfirm={true}
                    confirmMessage="Are you sure you want to delete? All associated comments will also be deleted."
                    refreshOnSuccess={false} // SSE will handle the update
                    withRedirect={false}
                    withToast={false}
                  />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        search ? (
          <EmptyState
            title="No posts found"
            description="There are no posts for your search"
            icon={<SvgSearch size="size-16" />}
          />
        ) : (
          <EmptyState
            title="No posts yet"
            description="Here will be the new posts created"
            icon={<SvgPost size="size-16" />}
          />
        )
      )}

    </div>
  );
};

export default BoardPrivatePostsList;
