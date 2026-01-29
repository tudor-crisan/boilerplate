import DashboardHeader from "@/modules/general/components/dashboard/DashboardHeader";
import DashboardMain from "@/modules/general/components/dashboard/DashboardMain";
import DashboardSuccess from "@/modules/general/components/dashboard/DashboardSuccess";
import DashboardWrapper from "@/modules/general/components/dashboard/DashboardWrapper";
import HeaderTop from "@/modules/general/components/header/HeaderTop";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";

export default async function SuccessPage() {
  return (
    <DashboardWrapper>
      <DashboardHeader>
        <HeaderTop url={settings.paths.home?.source} />
      </DashboardHeader>
      <DashboardMain className="min-h-[60vh]">
        <DashboardSuccess />
      </DashboardMain>
    </DashboardWrapper>
  );
}
