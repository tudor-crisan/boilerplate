"use client";
import Link from "next/link";
import { useStyling } from "@/context/ContextStyling";
import { useAuth } from "@/context/ContextAuth";
import { signIn } from "next-auth/react";

export default function ButtonLogin({ className = "", loggedInText = "Go to dashboard", loggedOutText = "Get started" }) {
  const { styling } = useStyling();
  const { isLoggedIn } = useAuth();
  const dashboardUrl = "/dashboard";

  if (isLoggedIn) {
    return (
      <Link
        href={dashboardUrl}
        className={`${styling.roundness[0]} ${styling.shadows[0]} btn btn-primary ${className}`}
      >
        {loggedInText}
      </Link>
    );
  }

  return (
    <button
      className={`${styling.roundness[0]} ${styling.shadows[0]} btn btn-primary ${className}`}
      onClick={() => {
        signIn(undefined, { callbackUrl: dashboardUrl })
      }}
    >
      {loggedOutText}
    </button>
  )
}
