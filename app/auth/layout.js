import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata("auth");
export default function LayoutAuth({ children }) {
  return children;
}
