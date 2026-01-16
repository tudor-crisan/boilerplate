import { Suspense } from "react";
import SectionFooter from "@/components/section/SectionFooter";

export default async function LayoutBlog({ children }) {
  return (
    <div className="font-sans">
      {children}

      <div className="h-24" />

      <SectionFooter />
    </div>
  );
}
