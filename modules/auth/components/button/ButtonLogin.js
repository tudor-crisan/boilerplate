"use client";
import { useAuth } from "@/modules/auth/context/ContextAuth";
import Button from "@/modules/general/components/button/Button";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import { signIn } from "next-auth/react";

export default function ButtonLogin({
  className = "",
  loggedInText = "Go to dashboard",
  loggedOutText = "Get started",
}) {
  const { isLoggedIn } = useAuth();
  const dashboardUrl = settings.paths.dashboard?.source;

  if (isLoggedIn) {
    return (
      <Button href={dashboardUrl} className={className} variant="btn-primary">
        {loggedInText}
      </Button>
    );
  }

  return (
    <Button
      className={className}
      variant="btn-primary"
      onClick={async () => {
        await signIn(undefined, { callbackUrl: dashboardUrl });
        await new Promise((resolve) => setTimeout(resolve, 60000));
      }}
    >
      {loggedOutText}
    </Button>
  );
}
