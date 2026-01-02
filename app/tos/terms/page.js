import Terms from "@/components/tos/Terms";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata("terms");

export default function TosTerms() {
  return <Terms />;
}
