
import BoardDisplay from "@/components/modules/board/BoardDisplay";
import { getBoardPrivate } from "@/libs/apps/boards/db";
import { redirect } from "next/navigation";

export default async function PrivateFeedbackBoard({ params }) {
  const { boardId } = await params;
  const board = await getBoardPrivate(boardId);

  if (!board) {
    redirect("/dashboard");
  }

  return (
    <BoardDisplay>
      {board.name} (private)
    </BoardDisplay>
  )
}