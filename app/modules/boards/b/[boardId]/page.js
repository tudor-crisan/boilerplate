import { getBoardPublic, getPosts } from "@/libs/modules/boards/db";
import { redirect } from "next/navigation";
import { getMetadata } from "@/libs/seo";
import Title from "@/components/common/Title";
import Main from "@/components/common/Main";
import FormCreate from "@/components/form/FormCreate";
import ItemDisplay from "@/components/list/ItemDisplay";

export async function generateMetadata({ params }) {
  const { boardId } = await params;
  const board = await getBoardPublic(boardId);

  return getMetadata("modules.board", {
    boardName: board?.name || "Board",
  });
}

export default async function PublicFeedbackBoard({ params }) {
  const { boardId } = await params;
  const board = await getBoardPublic(boardId);
  const posts = await getPosts(boardId);

  if (!board) {
    redirect("/");
  }

  return (
    <Main className="bg-base-200 space-y-4 p-6">
      <Title>
        {board.name}
      </Title>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <FormCreate
          type="Post"
          queryParams={{ boardId }}
        />
        <ItemDisplay
          items={posts}
        />
      </div>
    </Main>
  )
}