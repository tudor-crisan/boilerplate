import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardSectionHeader from "@/components/dashboard/DashboardSectionHeader";
import DashboardSectionMain from "@/components/dashboard/DashboardSectionMain";
import dashboards from "@/lists/dashboards";
import { defaultSetting as settings } from "@/libs/defaults";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata();
export default function PagesDashboard() {
  const component = settings.pages.dashboard.component
  const Component = dashboards[component];

  return (
    <DashboardWrapper>
      <DashboardSectionHeader />
      <DashboardSectionMain>
        {Component ? <Component /> : null}
      </DashboardSectionMain>
    </DashboardWrapper>
  )
}