import ButtonCheckout from "@/components/button/ButtonCheckout";
import ButtonPortal from "@/components/button/ButtonPortal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMain from "@/components/dashboard/DashboardMain";
import DashboardProfile from "@/components/dashboard/DashboardProfile";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import HeaderTop from "@/components/header/HeaderTop";
import { getUser } from "@/libs/db";
import { defaultSetting as settings } from "@/libs/defaults";
import dashboards from "@/lists/dashboards";
import ButtonLogout from "@/modules/auth/components/button/ButtonLogout";

export default async function PagesDashboard() {
  const DashboardComponent = dashboards[settings.components.dashboard];
  const { hasAccess } = (await getUser()) || {};

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
  );
}
