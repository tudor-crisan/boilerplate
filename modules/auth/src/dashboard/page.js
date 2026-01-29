import PagesDashboard from "@/modules/auth/components/pages/PagesDashboard";
import { getMetadata } from "@/modules/general/libs/seo";

export const metadata = getMetadata("dashboard");
export default function Dashboard() {
  return <PagesDashboard />;
}
