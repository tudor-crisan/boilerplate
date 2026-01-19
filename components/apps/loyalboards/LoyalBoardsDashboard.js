
import FormCreate from "@/components/form/FormCreate";
import BoardDashboardList from "@/components/modules/boards/dashboard/List";
import BoardDashboardAnalytics from "@/components/modules/boards/analytics/Dashboard";
import BoardDashboardNotifications from "@/components/modules/boards/dashboard/Notifications";
import { getUser } from "@/libs/modules/boards/db";
import { defaultSetting as settings } from "@/libs/defaults";
import Error from "@/components/common/Error";

const ERROR_MESSAGE = "Error: Unable to load the boards. Please contact support";

export default async function LoyalBoardsDashboard() {
  const user = await getUser("boards");

  if (!user) {
    return <Error message={ERROR_MESSAGE} />;
  }

  const { boards = [] } = user;
  const { source } = settings.paths.boardPrivate;

  const type = "Board";

  const list = [...boards].map((board) => ({
    ...board,
    href: source.replace(":boardId", board._id),
  }));

  return (
    <div className="space-y-6">
      <BoardDashboardAnalytics />
      <BoardDashboardNotifications />
      <FormCreate
        type={type}
      />
      <BoardDashboardList
        initialBoards={list}
        type={type}
      />
    </div>
  );
}