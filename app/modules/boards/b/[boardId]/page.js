import { getBoardPublic } from "@/libs/modules/boards/db";
import { redirect } from "next/navigation";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata("modules.board");
export default async function PublicFeedbackBoard({ params }) {
  const { boardId } = await params;
  const board = await getBoardPublic(boardId);

  if (!board) {
    redirect("/");
  }

  return (
    <main className="bg-base-200 min-h-screen">
      <h1 className="font-extrabold text-xl mb-4">
        {board.name} (public)
      </h1>
    </main>
  )
}