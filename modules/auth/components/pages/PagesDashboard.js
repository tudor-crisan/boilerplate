import ButtonCheckout from "@/modules/auth/components/button/ButtonCheckout";
import ButtonLogout from "@/modules/auth/components/button/ButtonLogout";
import ButtonPortal from "@/modules/auth/components/button/ButtonPortal";
import DashboardProfile from "@/modules/auth/components/dashboard/DashboardProfile";
import DashboardHeader from "@/modules/general/components/dashboard/DashboardHeader";
import DashboardMain from "@/modules/general/components/dashboard/DashboardMain";
import DashboardWrapper from "@/modules/general/components/dashboard/DashboardWrapper";
import HeaderTop from "@/modules/general/components/header/HeaderTop";
import { getUser } from "@/modules/general/libs/db";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import dashboards from "@/modules/general/lists/dashboards";

export default async function PagesDashboard() {
  const DashboardComponent = dashboards[settings.components.dashboard];
  const { hasAccess } = (await getUser()) || {};

  return (
    <DashboardWrapper>
      <DashboardHeader>
        <HeaderTop url={settings.paths.home?.source} />
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
