import PagesSupport from "@/components/pages/PagesSupport";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata("support");

export default function TosSupport() {
  return <PagesSupport />;
}
