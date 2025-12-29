import { getBoardPublic } from "@/libs/modules/boards/db";
import { redirect } from "next/navigation";
import { getMetadata } from "@/libs/seo";
import Title from "@/components/common/Title";
import Main from "@/components/common/Main";
import FormCreate from "@/components/form/FormCreate";

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

  if (!board) {
    redirect("/");
  }

  return (
    <Main className="bg-base-200 space-y-8 p-4">
      <Title>
        {board.name}
      </Title>
      <FormCreate
        type="Post"
        queryParams={{ boardId }}
      />
    </Main>
  )
}