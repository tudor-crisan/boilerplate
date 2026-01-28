import PagesTerms from "@/components/pages/PagesTerms";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata("terms");

export default function TosTerms() {
  return <PagesTerms />;
}
