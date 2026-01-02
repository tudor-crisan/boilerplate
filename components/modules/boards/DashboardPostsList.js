"use client";
import ItemDisplay from "@/components/list/ItemDisplay";
import ButtonDelete from "@/components/button/ButtonDelete";
import Title from "@/components/common/Title";
import useBoardPosts from "@/hooks/useBoardPosts";

const DashboardPostsList = ({ posts, boardId }) => {
  const { posts: postsState, handleVote } = useBoardPosts(boardId, posts);

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
            withRedirect={false}
          />
        )}
      />
    </div>
  );
};

export default DashboardPostsList;
