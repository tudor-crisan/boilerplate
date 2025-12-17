import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardSectionHeader from "@/components/dashboard/DashboardSectionHeader";
import DashboardSectionMain from "@/components/dashboard/DashboardSectionMain";
import components from "@/lists/components";
import { defaultSetting as settings } from "@/libs/defaults";

export default function PagesDashboard() {
  const component = settings.pages.dashboard.component
  const Component = components.dashboards[component];

  return (
    <DashboardWrapper>
      <DashboardSectionHeader />
      <DashboardSectionMain>
        {Component ? <Component /> : null}
      </DashboardSectionMain>
    </DashboardWrapper>
  )
}