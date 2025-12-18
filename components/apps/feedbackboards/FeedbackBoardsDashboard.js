
import FormCreate from "@/components/form/FormCreate";
import ListDisplay from "@/components/list/ListDisplay";
import { getUser } from "@/libs/apps/feedbackboards/db";

export default async function FeedbackBoardsDashboard() {
  const { boards } = await getUser("boards");
  return (
    <div className="space-y-6">
      <FormCreate
        type="Board"
      />
      <ListDisplay
        type="Board"
        list={boards.reverse()}
      />
    </div>
  );
}