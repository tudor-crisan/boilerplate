
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMain from "@/components/dashboard/DashboardMain";
import HeaderTop from "@/components/header/HeaderTop";
import ButtonLogout from "@/components/button/ButtonLogout";
import DashboardProfile from "@/components/dashboard/DashboardProfile";
import dashboards from "@/lists/dashboards";
import ButtonCheckout from "@/components/button/ButtonCheckout";
import { defaultSetting as settings } from "@/libs/defaults";
import { getUser } from "@/libs/modules/boards/db";
import ButtonPortal from "@/components/button/ButtonPortal";

export default async function PagesDashboard({ children }) {
  const DashboardComponent = dashboards[settings.components.dashboard];
  const { hasAccess } = await getUser();

  return (
    <DashboardWrapper>
      <DashboardHeader>
        <HeaderTop url={settings.paths.home.source} />
        <div className="flex gap-2">
          {hasAccess ? <ButtonPortal /> : <ButtonCheckout />}
          <ButtonLogout />
        </div>
      </DashboardHeader>
      <DashboardMain className="space-y-6">
        <DashboardProfile />
        <DashboardComponent />
      </DashboardMain>
    </DashboardWrapper>
  )
}