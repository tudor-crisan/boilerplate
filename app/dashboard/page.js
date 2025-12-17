import PagesDashboard from "@/components/pages/PagesDashboard";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata();
export default function Dashboard() {
  return (
    <PagesDashboard />
  );
}
