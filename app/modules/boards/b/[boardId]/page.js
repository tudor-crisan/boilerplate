import { getBoardPublic } from "@/libs/modules/boards/db";
import { redirect } from "next/navigation";
import { getMetadata } from "@/libs/seo";
import { defaultSetting as settings } from "@/libs/defaults";
import BoardPublicClient from "@/components/modules/boards/BoardPublicClient";

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
    redirect(settings.paths.home.source);
  }

  // Serialize board data to ensure it's safe to pass to Client Component (handles ObjectIds, Dates)
  const serializableBoard = JSON.parse(JSON.stringify(board));

  return <BoardPublicClient board={serializableBoard} />;
}