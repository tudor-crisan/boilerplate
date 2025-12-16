"use client";
import Link from "next/link";
import { useStyling } from "@/components/context/ContextStyling";
import { useAuth } from "@/components/context/ContextAuth";

export default function ButtonLogout() {
  const { styling } = useStyling();
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return (
      <Link
        href="/api/auth/signout"
        className={`${styling.roundness[0]} ${styling.shadows[0]} btn btn-primary`}
      >
        Logout
      </Link>
    );
  }

  return (
    <p>Not logged in</p>
  );
}
