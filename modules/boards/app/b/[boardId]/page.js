import BoardPublicClient from "@/modules/boards/components/PublicClient";
import { getBoardPublic } from "@/modules/boards/libs/db";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import { getMetadata } from "@/modules/general/libs/seo";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }) {
  const { boardId } = await params;
  const board = await getBoardPublic(boardId);

  return getMetadata("modules.board", {
    boardName: board?.name || "Board",
  });
}

export default async function PublicFeedbackBoard({ params }) {
  const { boardId } = await params;
  const board = await getBoardPublic(boardId, "posts");

  if (!board) {
    redirect(settings.paths.home?.source);
  }

  // Serialize board data to ensure it's safe to pass to Client Component (handles ObjectIds, Dates)
  const serializableBoard = JSON.parse(JSON.stringify(board));

  return <BoardPublicClient board={serializableBoard} />;
}
