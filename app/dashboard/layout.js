"use client";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/ContextAuth";
import { defaultSetting as settings } from "@/libs/defaults";

export default function LayoutDashboard({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    redirect(settings.paths.home.source);
  }

  return children;
}