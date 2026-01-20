import PagesHelp from "@/components/pages/PagesHelp";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata("help");

export default function TosHelp() {
  return <PagesHelp />;
}
