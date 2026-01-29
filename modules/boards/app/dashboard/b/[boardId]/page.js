import BoardAnalyticsWidget from "@/modules/boards/components/analytics/Widget";
import BoardPrivatePostsList from "@/modules/boards/components/posts/PrivateList";
import BoardEditModal from "@/modules/boards/components/ui/EditModal";
import { getBoardPrivate } from "@/modules/boards/libs/db";
import ButtonBack from "@/modules/general/components/button/ButtonBack";
import ButtonDelete from "@/modules/general/components/button/ButtonDelete";
import Columns from "@/modules/general/components/common/Columns";
import Label from "@/modules/general/components/common/Label";
import Sidebar from "@/modules/general/components/common/Sidebar";
import Title from "@/modules/general/components/common/Title";
import Vertical from "@/modules/general/components/common/Vertical";
import DashboardHeader from "@/modules/general/components/dashboard/DashboardHeader";
import DashboardMain from "@/modules/general/components/dashboard/DashboardMain";
import DashboardWrapper from "@/modules/general/components/dashboard/DashboardWrapper";
import InputCopy from "@/modules/general/components/input/InputCopy";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import { getMetadata } from "@/modules/general/libs/seo";
import { baseUrl } from "@/modules/general/libs/utils.client";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }) {
  const { boardId } = await params;
  const board = await getBoardPrivate(boardId);

  return getMetadata("modules.board", {
    boardName: board?.name || "Board",
  });
}

export default async function PrivateFeedbackBoard({ params }) {
  const backUrl = settings.paths.dashboard?.source;
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
              <Title className="line-clamp-2 break-all">{board.name}</Title>
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
                  extraSettings={board.extraSettings}
                />
                <ButtonDelete
                  url={deleteUrl}
                  buttonText="Delete board"
                  confirmMessage="Are you sure you want to delete? All associated posts will also be deleted."
                />
              </div>

              <div className="pt-6 border-t border-base-200">
                <BoardAnalyticsWidget boardId={boardId} />
              </div>
            </div>
          </Sidebar>
          <BoardPrivatePostsList posts={board.posts} boardId={boardId} />
        </Columns>
      </DashboardMain>
    </DashboardWrapper>
  );
}
