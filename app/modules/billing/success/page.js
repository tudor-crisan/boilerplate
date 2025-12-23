
import Paragraph from "@/components/common/Paragraph";
import Title from "@/components/common/Title";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMain from "@/components/dashboard/DashboardMain";
import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import HeaderButton from "@/components/header/HeaderButton";
import HeaderTop from "@/components/header/HeaderTop";

export default async function SuccessPage() {
  return (
    <DashboardWrapper>
      <DashboardHeader>
        <HeaderTop url="/" />
        <HeaderButton />
      </DashboardHeader>
      <DashboardMain className="space-y-2">
        <Title>Thank you for your purchase ❤️</Title>
        <Paragraph>You have access now to all features. Go to &quot;Dashboard&quot; and start using.</Paragraph>
      </DashboardMain>
    </DashboardWrapper>
  );
}
