import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMain from "@/components/dashboard/DashboardMain";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import HeaderTop from "@/components/header/HeaderTop";
import { defaultSetting as settings } from "@/libs/defaults";
import DashboardSuccessView from "@/components/dashboard/DashboardSuccessView";

export default async function SuccessPage() {
  return (
    <DashboardWrapper>
      <DashboardHeader>
        <HeaderTop url={settings.paths.home.source} />
      </DashboardHeader>
      <DashboardMain className="min-h-[60vh]">
        <DashboardSuccessView />
      </DashboardMain>
    </DashboardWrapper>
  );
}
