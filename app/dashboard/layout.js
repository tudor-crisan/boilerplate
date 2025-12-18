"use client";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/ContextAuth";
import { getMetadata } from "@/libs/seo";

export const metadata = getMetadata("dashboard");
export default function LayoutDashboard({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    redirect("/");
  }

  return children;
}