"use client";
import { defaultSetting as settings } from "@/libs/defaults";
import { useAuth } from "@/modules/auth/context/ContextAuth";
import { redirect } from "next/navigation";

export default function LayoutDashboard({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    redirect(settings.paths.home.source);
  }

  return children;
}
