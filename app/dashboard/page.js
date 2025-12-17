import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardSectionTop from "@/components/dashboard/DashboardSectionTop";
import DashboardSectionMain from "@/components/dashboard/DashboardSectionMain";
import FormNewBoard from "@/components/form/FormNewBoard";

export default function Dashboard() {
  return (
    <DashboardWrapper>
      <DashboardSectionTop />
      <DashboardSectionMain>
        <FormNewBoard />
      </DashboardSectionMain>
    </DashboardWrapper>
  );
}
