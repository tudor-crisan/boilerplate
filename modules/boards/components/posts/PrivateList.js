"use client";
import useBoardFiltering from "@/modules/boards/hooks/useBoardFiltering";
import useBoardPosts from "@/modules/boards/hooks/useBoardPosts";
import ButtonDelete from "@/modules/general/components/button/ButtonDelete";
import EmptyState from "@/modules/general/components/common/EmptyState";
import FilterBar from "@/modules/general/components/common/FilterBar";
import Paragraph from "@/modules/general/components/common/Paragraph";
import TextSmall from "@/modules/general/components/common/TextSmall";
import Title from "@/modules/general/components/common/Title";
import SvgPost from "@/modules/general/components/svg/SvgPost";
import SvgSearch from "@/modules/general/components/svg/SvgSearch";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import { formattedDate } from "@/modules/general/libs/utils.client";
import { AnimatePresence, motion } from "framer-motion";

const BoardPrivatePostsList = ({ posts, boardId }) => {
  const { styling } = useStyling();
  const { posts: postsState } = useBoardPosts(boardId, posts);

  const { search, setSearch, sort, setSort, filteredPosts, sortOptions } =
    useBoardFiltering(postsState);

  return (
    <div className="space-y-4 w-full min-w-0">
      <Title>Posts ({filteredPosts?.length || 0})</Title>

      {postsState?.length > 0 && (
        <FilterBar
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
                  opacity: { duration: 0.2 },
                }}
                className={`${styling.components.card} ${styling.general.box} block`}
              >
                <div className="space-y-1 mb-4">
                  <Title className="wrap-break-word line-clamp-2 mb-4">
                    {item.title}
                  </Title>
                  <Paragraph className="max-h-32 wrap-break-word">
                    {item.description}
                  </Paragraph>
                </div>

                <div className={styling.flex.between}>
                  <div className={`${styling.flex.col} space-y-2`}>
                    <TextSmall className="text-base-content/50">
                      {formattedDate(item.createdAt)}
                    </TextSmall>
                    <TextSmall>
                      {item.votesCounter || 0} votes • {item.commentsCount || 0}{" "}
                      comments
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
      ) : search ? (
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
      )}
    </div>
  );
};

export default BoardPrivatePostsList;
