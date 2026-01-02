import Privacy from "@/components/tos/Privacy";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata("privacy");

export default function TosPrivacy() {
  return <Privacy />;
}
