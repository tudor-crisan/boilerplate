"use client";
import { useAuth } from "@/context/ContextAuth";
import { signIn } from "next-auth/react";
import Button from "@/components/button/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ButtonLogin({ className = "", loggedInText = "Go to dashboard", loggedOutText = "Get started" }) {
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const dashboardUrl = "/dashboard";

  if (isLoggedIn) {
    return (
      <Button
        isLoading={loading}
        className={className}
        variant="btn-primary"
        onClick={() => {
          setLoading(true);
          router.push(dashboardUrl);
        }}
      >
        {loggedInText}
      </Button>
    );
  }

  return (
    <Button
      isLoading={loading}
      className={className}
      variant="btn-primary"
      onClick={() => {
        setLoading(true);
        signIn(undefined, { callbackUrl: dashboardUrl })
      }}
    >
      {loggedOutText}
    </Button>
  )
}
