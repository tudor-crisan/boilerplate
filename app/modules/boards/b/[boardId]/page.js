import { getBoardPublic } from "@/libs/modules/boards/db";
import { redirect } from "next/navigation";
import { getMetadata } from "@/libs/seo";
import GeneralTitle from "@/components/general/GeneralTitle";
import GeneralMain from "@/components/general/GeneralMain";

export const metadata = getMetadata("modules.board");
export default async function PublicFeedbackBoard({ params }) {
  const { boardId } = await params;
  const board = await getBoardPublic(boardId);

  if (!board) {
    redirect("/");
  }

  return (
    <GeneralMain className="bg-base-200">
      <GeneralTitle>
        {board.name} (public)
      </GeneralTitle>
    </GeneralMain>
  )
}