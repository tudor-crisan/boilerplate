
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardMain from "@/components/dashboard/DashboardMain";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ButtonBack from "@/components/button/ButtonBack";
import InputCopy from "@/components/input/InputCopy";
import { getBoardPrivate } from "@/libs/modules/boards/db";
import { redirect } from "next/navigation";
import { baseUrl } from "@/libs/utils.client";
import { getMetadata } from "@/libs/seo";
import ButtonDelete from "@/components/button/ButtonDelete";
import GeneralTitle from "@/components/general/GeneralTitle";

export const metadata = getMetadata("modules.board");
export default async function PrivateFeedbackBoard({ params }) {
  const backUrl = "/dashboard";
  const { boardId } = await params;

  const board = await getBoardPrivate(boardId);
  const deleteUrl = `/api/modules/boards/board?boardId=${boardId}`;

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
          <GeneralTitle>
            {board.name} (private)
          </GeneralTitle>
          <InputCopy value={`${baseUrl()}/b/${boardId}`} />
          <ButtonDelete
            url={deleteUrl}
            buttonText="Delete Board"
          />
        </div>
      </DashboardMain>
    </DashboardWrapper>

  )
}