import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardSectionHeader from "@/components/dashboard/DashboardSectionHeader";
import DashboardSectionMain from "@/components/dashboard/DashboardSectionMain";
import FormNewBoard from "@/components/form/FormNewBoard";

export default function Dashboard() {
  return (
    <DashboardWrapper>
      <DashboardSectionHeader />
      <DashboardSectionMain>
        <FormNewBoard />
      </DashboardSectionMain>
    </DashboardWrapper>
  );
}
