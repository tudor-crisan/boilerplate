
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardMain from "@/components/dashboard/DashboardMain";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ButtonBack from "@/components/button/ButtonBack";
import InputCopy from "@/components/input/InputCopy";
import { getBoardPrivate } from "@/libs/modules/boards/db";
import { redirect } from "next/navigation";
import { baseUrl } from "@/libs/utils.client";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata("modules.board");
export default async function PrivateFeedbackBoard({ params }) {
  const { boardId } = await params;
  const board = await getBoardPrivate(boardId);
  const backUrl = "/dashboard";

  if (!board) {
    redirect(backUrl);
  }

  return (
    <DashboardWrapper>
      <DashboardHeader>
        <ButtonBack url={backUrl} />
      </DashboardHeader>
      <DashboardMain>
        <div className="space-y-4">
          <h1 className="font-extrabold text-xl">
            {board.name} (private)
          </h1>
          <InputCopy value={`${baseUrl()}/b/${boardId}`} />
        </div>
      </DashboardMain>
    </DashboardWrapper>

  )
}