"use client";
import Button from "@/components/button/Button";
import { useAuth } from "@/modules/auth/context/ContextAuth";
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
      >
        Logout
      </Button>
    );
  }

  return null;
}
