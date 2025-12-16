"use client";;
import { useStyling } from "@/context/ContextStyling";
import { useAuth } from "@/context/ContextAuth";
import { signOut } from "next-auth/react";

export default function ButtonLogout() {
  const { styling } = useStyling();
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return (
      <button
        className={`${styling.roundness[0]} ${styling.shadows[0]} btn btn-base`}
        onClick={() => signOut()}
      >
        Logout
      </button>
    );
  }

  return null;
}
