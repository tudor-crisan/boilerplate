import PagesPrivacy from "@/modules/general/components/pages/PagesPrivacy";
import { getMetadata } from "@/modules/general/libs/seo";

export const metadata = getMetadata("privacy");

export default function TosPrivacy() {
  return <PagesPrivacy />;
}
