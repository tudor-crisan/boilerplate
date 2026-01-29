"use client";
import { useAuth } from "@/modules/auth/context/ContextAuth";
import Button from "@/modules/general/components/button/Button";
import SvgLogout from "@/modules/general/components/svg/SvgLogout";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function ButtonLogout() {
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return (
      <Button
        isLoading={loading}
        variant="btn-base"
        onClick={() => {
          setLoading(true);
          localStorage.removeItem("styling-config");
          signOut();
        }}
        className="text-error"
      >
        <span className="hidden sm:inline">Logout</span>
        <SvgLogout className="w-5 h-5 sm:hidden" />
      </Button>
    );
  }

  return null;
}
