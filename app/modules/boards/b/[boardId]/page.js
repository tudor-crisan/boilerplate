import { getBoardPublic } from "@/libs/modules/boards/db";
import { redirect } from "next/navigation";
import { getMetadata } from "@/libs/seo";
import Title from "@/components/common/Title";
import Main from "@/components/common/Main";
import Columns from "@/components/common/Columns";
import Sidebar from "@/components/common/Sidebar";
import FormCreate from "@/components/form/FormCreate";
import BoardPostsList from "@/components/modules/boards/BoardPostsList";
import { defaultStyling } from "@/libs/defaults";

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
    redirect("/");
  }

  return (
    <Main className={`bg-base-200 ${defaultstyling.general.padding}`}>
      <div className="max-w-5xl space-y-4 mx-auto w-full">
        <Title>
          {board.name}
        </Title>
        <Columns>
          <Sidebar>
            <FormCreate
              type="Post"
              queryParams={{ boardId }}
              skipRefresh={true}
            />
          </Sidebar>
          <BoardPostsList
            posts={board.posts}
            boardId={boardId}
          />
        </Columns>
      </div>
    </Main>
  )
}