
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardMain from "@/components/dashboard/DashboardMain";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ButtonBack from "@/components/button/ButtonBack";
import InputCopy from "@/components/input/InputCopy";
import ButtonDelete from "@/components/button/ButtonDelete";
import Title from "@/components/common/Title";
import Columns from "@/components/common/Columns";
import Sidebar from "@/components/common/Sidebar";
import Label from "@/components/common/Label";
import Vertical from "@/components/common/Vertical";
import DashboardPostsList from "@/components/modules/boards/DashboardPostsList";
import BoardEditModal from "@/components/modules/boards/BoardEditModal";
import { defaultSetting as settings } from "@/libs/defaults";
import { getBoardPrivate } from "@/libs/modules/boards/db";
import { redirect } from "next/navigation";
import { baseUrl } from "@/libs/utils.client";
import { getMetadata } from "@/libs/seo";

export async function generateMetadata({ params }) {
  const { boardId } = await params;
  const board = await getBoardPrivate(boardId);

  return getMetadata("modules.board", {
    boardName: board?.name || "Board",
  });
}

export default async function PrivateFeedbackBoard({ params }) {
  const backUrl = settings.paths.dashboard.source;
  const { boardId } = await params;

  const board = await getBoardPrivate(boardId, "posts");
  const deleteUrl = `${settings.paths.api.boardsDetail}?boardId=${boardId}`;

  if (!board) {
    redirect(backUrl);
  }

  const boardUrl = `${baseUrl()}/b/${board.slug || boardId}`;

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
              <Vertical>
                <Label>Public link</Label>
                <InputCopy
                  value={boardUrl}
                  openUrl={boardUrl}
                  tooltipCopy="Copy link"
                  tooltipOpen="Go to board"
                />
              </Vertical>
              <div className="flex gap-2">
                <BoardEditModal
                  boardId={boardId}
                  currentSlug={board.slug}
                  currentName={board.name}
                />
                <ButtonDelete
                  url={deleteUrl}
                  buttonText="Delete board"
                />
              </div>
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
