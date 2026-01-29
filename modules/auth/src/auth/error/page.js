"use client";
import PagesAuth from "@/modules/auth/components/pages/PagesAuth";
import { useAuthError } from "@/modules/auth/hooks/useAuthError";
import Button from "@/modules/general/components/button/Button";
import ButtonBack from "@/modules/general/components/button/ButtonBack";
import SvgError from "@/modules/general/components/svg/SvgError";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { Suspense } from "react";

const SIGNIN_URL = "/auth/signin";

function ErrorContent() {
  const { message, error } = useAuthError();

  return (
    <PagesAuth
      title="Authentication Error"
      description={message}
      icon={<SvgError className="size-16 text-error" />}
    >
      {error !== "RateLimit" && (
        <Button href={SIGNIN_URL} className="w-full">
          Try Again
        </Button>
      )}
      <div className="mx-auto mt-2">
        <ButtonBack className="btn-ghost btn-md! shadow-none!" />
      </div>
    </PagesAuth>
  );
}

export default function AuthErrorPage() {
  const { styling } = useStyling();
  return (
    <Suspense
      fallback={
        <div className={`min-h-screen ${styling.flex.center}`}>Loading...</div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
