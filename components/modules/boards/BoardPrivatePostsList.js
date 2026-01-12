"use client";
import EmptyState from "@/components/common/EmptyState";
import SvgPost from "@/components/svg/SvgPost";
import ItemDisplay from "@/components/list/ItemDisplay";
import ButtonDelete from "@/components/button/ButtonDelete";
import TextSmall from "@/components/common/TextSmall";
import Title from "@/components/common/Title";
import useBoardPosts from "@/hooks/modules/boards/useBoardPosts";
import Vertical from "@/components/common/Vertical";
import { defaultSetting as settings } from "@/libs/defaults";

const BoardPrivatePostsList = ({ posts, boardId }) => {
  const { posts: postsState } = useBoardPosts(boardId, posts);

  return (
    <div className="space-y-4 w-full min-w-0">
      <Title>Posts ({postsState?.length || 0})</Title>
      {postsState?.length > 0 ? (
        <ItemDisplay
          items={postsState}
          itemAction={(item) => (
            <Vertical className="text-right">
              <ButtonDelete
                url={`${settings.paths.api.boardsPost}?postId=${item._id}`}
                buttonText="Delete"
                withConfirm={true}
                confirmMessage="Are you sure you want to delete this post?"
                refreshOnSuccess={false} // SSE will handle the update
                withRedirect={false}
                withToast={false}
              />
              <TextSmall>
                {item.votesCounter || 0} votes • {item.commentsCount || 0} comments
              </TextSmall>
            </Vertical>
          )}
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
