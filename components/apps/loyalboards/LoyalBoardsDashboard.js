
import FormCreate from "@/components/form/FormCreate";
import ListDisplay from "@/components/list/ListDisplay";
import { getUser } from "@/libs/modules/boards/db";
import { defaultSetting as settings } from "@/libs/defaults";

export default async function LoyalBoardsDashboard() {
  const user = await getUser("boards");

  if (!user) {
    return <div className="p-4 text-red-500">Error: Unable to load user data.</div>;
  }

  const { boards = [] } = user;
  const { source } = settings.pages.paths.boardPrivate;

  const type = "Board";
  const list = [...boards].reverse();
  const link = (item) => source.replace(":boardId", item._id);

  return (
    <div className="space-y-6">
      <FormCreate type={type} />
      <ListDisplay type={type} list={list} link={link} />
    </div>
  );
}