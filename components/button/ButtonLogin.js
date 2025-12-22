"use client";
import { useAuth } from "@/context/ContextAuth";
import { signIn } from "next-auth/react";
import Button from "@/components/button/Button";

export default function ButtonLogin({ className = "", loggedInText = "Go to dashboard", loggedOutText = "Get started" }) {
  const { isLoggedIn } = useAuth();
  const dashboardUrl = "/dashboard";

  if (isLoggedIn) {
    return (
      <Button
        href={dashboardUrl}
        className={className}
        variant="btn-primary"
      >
        {loggedInText}
      </Button>
    );
  }

  return (
    <Button
      className={className}
      variant="btn-primary"
      onClick={() => {
        signIn(undefined, { callbackUrl: dashboardUrl })
      }}
    >
      {loggedOutText}
    </Button>
  )
}
