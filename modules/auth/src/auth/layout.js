import { getMetadata } from "@/modules/general/libs/seo";

export const metadata = getMetadata("auth");
export default function LayoutAuth({ children }) {
  return children;
}
