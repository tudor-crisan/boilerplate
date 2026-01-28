import { getMetadata } from "@/libs/seo";
import PagesDashboard from "@/modules/auth/components/pages/PagesDashboard";

export const metadata = getMetadata("dashboard");
export default function Dashboard() {
  return <PagesDashboard />;
}
