
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMain from "@/components/dashboard/DashboardMain";
import HeaderTop from "@/components/header/HeaderTop";
import ButtonLogout from "@/components/button/ButtonLogout";
import DashboardMessage from "@/components/dashboard/DashboardMessage";
import dashboards from "@/lists/dashboards";
import ButtonCheckout from "@/components/button/ButtonCheckout";
import { defaultSetting as settings } from "@/libs/defaults";
import { getUser } from "@/libs/modules/boards/db";
import ButtonPortal from "@/components/button/ButtonPortal";

export default async function PagesDashboard({ children }) {
  const component = settings.components.dashboard
  const Component = dashboards[component];
  const user = await getUser();
  const { hasAccess } = user || {};

  return (
    <DashboardWrapper>
      <DashboardHeader>
        <HeaderTop url="/" />
        <div className="flex gap-2">
          {!hasAccess ? <ButtonCheckout /> : <ButtonPortal />}
          <ButtonLogout />
        </div>
      </DashboardHeader>
      <DashboardMain>
        <DashboardMessage />
        <div className="my-6">
          {children || <Component /> || null}
        </div>
      </DashboardMain>
    </DashboardWrapper>
  )
}