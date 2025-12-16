"use client";
import Link from "next/link";
import { useStyling } from "@/components/context/ContextStyling";
import { useAuth } from "@/components/context/ContextAuth";

export default function ButtonLogin({ className = "", loggedInText = "Go to dashboard", loggedOutText = "Get started" }) {
  const { styling } = useStyling();
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return (
      <Link
        href="/dashboard"
        className={`${styling.roundness[0]} ${styling.shadows[0]} btn btn-primary ${className}`}
      >
        {loggedInText}
      </Link>
    );
  }

  return (
    <Link
      href="/api/auth/signin"
      className={`${styling.roundness[0]} ${styling.shadows[0]} btn btn-outline ${className}`}
    >
      {loggedOutText}
    </Link>
  );
}
