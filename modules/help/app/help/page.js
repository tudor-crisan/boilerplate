import { getMetadata } from "@/modules/general/libs/seo";
import PagesHelp from "@/modules/help/components/pages/PagesHelp";

export const metadata = getMetadata("help");

export default function HelpPage() {
  return <PagesHelp />;
}
