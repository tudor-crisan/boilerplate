import Support from "@/components/tos/Support";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata("support");

export default function TosSupport() {
  return <Support />;
}
