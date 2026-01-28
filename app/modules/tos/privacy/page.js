import PagesPrivacy from "@/components/pages/PagesPrivacy";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata("privacy");

export default function TosPrivacy() {
  return <PagesPrivacy />;
}
