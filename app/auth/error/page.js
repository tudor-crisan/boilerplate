"use client";
import Button from "@/components/button/Button";
import ButtonBack from "@/components/button/ButtonBack";
import PagesAuth from "@/components/pages/PagesAuth";
import SvgError from "@/components/svg/SvgError";
import { useStyling } from "@/context/ContextStyling";
import { useAuthError } from "@/hooks/useAuthError";
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
