import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardSectionHeader from "@/components/dashboard/DashboardSectionHeader";
import DashboardSectionMain from "@/components/dashboard/DashboardSectionMain";
import FormCreate from "@/components/form/FormCreate";

export default function Dashboard() {
  return (
    <DashboardWrapper>
      <DashboardSectionHeader />
      <DashboardSectionMain>
        <FormCreate type="Board" />
      </DashboardSectionMain>
    </DashboardWrapper>
  );
}
