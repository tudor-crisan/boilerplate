
import { getBoardPrivate } from "@/libs/apps/feedbackboards/db";
import { redirect } from "next/navigation";

export default async function PrivateFeedbackBoard({ params }) {
  const { boardId } = await params;
  const board = await getBoardPrivate(boardId);

  if (!board) {
    redirect("/dashboard");
  }

  return (
    <div>{board.name} (private)</div>
  )
}