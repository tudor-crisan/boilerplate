"use client";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/ContextAuth";

export default function LayoutDashboard({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    redirect("/");
  }

  return children;
}