
import BoardDisplay from "@/components/modules/board/BoardDisplay";
import { getBoardPublic } from "@/libs/apps/boards/db";
import { redirect } from "next/navigation";

export default async function PublicFeedbackBoard({ params }) {
  const { boardId } = await params;
  const board = await getBoardPublic(boardId);

  if (!board) {
    redirect("/");
  }

  return (
    <BoardDisplay>
      {board.name} (public)
    </BoardDisplay>
  )
}