"use client";
import PagesHome from "@/components/pages/PagesHome";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata();
export default function PageHome() {
  return (
    <PagesHome />
  )
}
