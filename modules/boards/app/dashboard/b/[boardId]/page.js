import ButtonBack from "@/components/button/ButtonBack";
import ButtonDelete from "@/components/button/ButtonDelete";
import Columns from "@/components/common/Columns";
import Label from "@/components/common/Label";
import Sidebar from "@/components/common/Sidebar";
import Title from "@/components/common/Title";
import Vertical from "@/components/common/Vertical";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMain from "@/components/dashboard/DashboardMain";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import InputCopy from "@/components/input/InputCopy";
import { defaultSetting as settings } from "@/libs/defaults";
import { getMetadata } from "@/libs/seo";
import { baseUrl } from "@/libs/utils.client";
import BoardAnalyticsWidget from "@/modules/boards/components/analytics/Widget";
import BoardPrivatePostsList from "@/modules/boards/components/posts/PrivateList";
import BoardEditModal from "@/modules/boards/components/ui/EditModal";
import { getBoardPrivate } from "@/modules/boards/libs/db";
import { redirect } from "next/navigation";

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
