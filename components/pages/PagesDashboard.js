import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMain from "@/components/dashboard/DashboardMain";
import HeaderTop from "@/components/header/HeaderTop";
import ButtonLogout from "@/components/button/ButtonLogout";
import DashboardMessage from "@/components/dashboard/DashboardMessage";
import dashboards from "@/lists/dashboards";
import { defaultSetting as settings } from "@/libs/defaults";
import ButtonCheckout from "../button/ButtonCheckout";

export default function PagesDashboard({ children }) {
  const component = settings.pages.dashboard.component
  const Component = dashboards[component];

  return (
    <DashboardWrapper>
      <DashboardHeader>
        <HeaderTop url="/" />
        <div className="flex gap-2">
          <ButtonCheckout />
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