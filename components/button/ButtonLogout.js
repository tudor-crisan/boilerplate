"use client";;
import { useState } from "react";
import { useStyling } from "@/context/ContextStyling";
import { useAuth } from "@/context/ContextAuth";
import { signOut } from "next-auth/react";
import IconLoading from "../icon/IconLoading";

export default function ButtonLogout() {
  const [loading, setLoading] = useState(false);
  const { styling } = useStyling();
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return (
      <button
        disabled={loading}
        className={`${styling.roundness[0]} ${styling.shadows[0]} btn-sm sm:btn-md btn btn-base`}
        onClick={() => {
          setLoading(true);
          signOut();
        }}
      >
        {loading && <IconLoading />}
        Logout
      </button>
    );
  }

  return null;
}
