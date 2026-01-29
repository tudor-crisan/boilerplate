import PagesSupport from "@/modules/general/components/pages/PagesSupport";
import { getMetadata } from "@/modules/general/libs/seo";

export const metadata = getMetadata("support");

export default function TosSupport() {
  return <PagesSupport />;
}
