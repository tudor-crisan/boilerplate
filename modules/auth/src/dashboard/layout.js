"use client";
import { useAuth } from "@/modules/auth/context/ContextAuth";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import { redirect } from "next/navigation";

export default function LayoutDashboard({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    redirect(settings.paths.home?.source);
  }

  return children;
}
