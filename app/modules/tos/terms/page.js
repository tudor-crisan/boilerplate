import PagesTerms from "@/modules/general/components/pages/PagesTerms";
import { getMetadata } from "@/modules/general/libs/seo";

export const metadata = getMetadata("terms");

export default function TosTerms() {
  return <PagesTerms />;
}
