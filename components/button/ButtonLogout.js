"use client";;
import { useState } from "react";
import { useStyling } from "@/context/ContextStyling";
import { useAuth } from "@/context/ContextAuth";
import { signOut } from "next-auth/react";

export default function ButtonLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const { styling } = useStyling();
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return (
      <button
        disabled={isLoading}
        className={`${styling.roundness[0]} ${styling.shadows[0]} btn-sm sm:btn-md btn btn-base`}
        onClick={() => {
          setIsLoading(true);
          signOut();
        }}
      >
        {isLoading && <span className="loading loading-spinner loading-xs"></span>}
        Logout
      </button>
    );
  }

  return null;
}
