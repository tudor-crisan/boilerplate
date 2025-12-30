
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
import ItemDisplay from "@/components/list/ItemDisplay";

import Columns from "@/components/common/Columns";
import Sidebar from "@/components/common/Sidebar";

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

  const postsWithAction = board?.posts?.map(post => ({
    ...post,
    action: (
      <ButtonDelete
        url={`/api/modules/boards/post?postId=${post._id}`}
        buttonText="Delete"
        withConfirm={true}
        confirmMessage="Are you sure you want to delete this post?"
        redirectUrl={`/modules/boards/dashboard/b/${boardId}`}
      />
    )
  }));


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
              <InputCopy value={`${baseUrl()}/b/${boardId}`} />
              <ButtonDelete
                url={deleteUrl}
                buttonText="Delete Board"
              />
            </div>
          </Sidebar>
          <div className="space-y-4">
            <Title>Posts ({board?.posts?.length || 0})</Title>
            <ItemDisplay
              items={postsWithAction}
            />
          </div>
        </Columns>
      </DashboardMain>
    </DashboardWrapper>
  )
}