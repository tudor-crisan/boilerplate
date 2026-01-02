
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
import Title from "@/components/common/Title";

import Columns from "@/components/common/Columns";
import Sidebar from "@/components/common/Sidebar";
import Label from "@/components/common/Label";
import FormGroup from "@/components/common/FormGroup";
import DashboardPostsList from "@/components/modules/boards/DashboardPostsList";

export async function generateMetadata({ params }) {
  const { boardId } = await params;
  const board = await getBoardPrivate(boardId);

  return getMetadata("modules.board", {
    boardName: board?.name || "Board",
  });
}

export default async function PrivateFeedbackBoard({ params }) {
  const backUrl = "/dashboard";
  const { boardId } = await params;

  const board = await getBoardPrivate(boardId, "posts");
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
        <Columns>
          <Sidebar>
            <div className="space-y-4">
              <Title>
                {board.name}
              </Title>
              <FormGroup>
                <Label>Public link</Label>
                <InputCopy
                  value={`${baseUrl()}/b/${boardId}`}
                  openUrl={`${baseUrl()}/b/${boardId}`}
                  tooltipCopy="Copy link"
                  tooltipOpen="Go to board"
                />
              </FormGroup>
              <ButtonDelete
                url={deleteUrl}
                buttonText="Delete Board"
              />
            </div>
          </Sidebar>
          <DashboardPostsList
            posts={board.posts}
            boardId={boardId}
          />
        </Columns>
      </DashboardMain>
    </DashboardWrapper>
  )
}
