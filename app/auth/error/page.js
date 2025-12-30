"use client";
import { useAuth } from "@/context/ContextAuth";
import { useAuthError } from "@/hooks/useAuthError";
import { useStyling } from "@/context/ContextStyling";
import { Suspense } from "react";
import Button from "@/components/button/Button";
import SvgError from "@/components/svg/SvgError";
import ButtonBack from "@/components/button/ButtonBack";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";

const CALLBACK_URL = "/dashboard";
const SIGNIN_URL = "/auth/signin";

function ErrorContent() {
  const { styling } = useStyling();
  const { message, error } = useAuthError();
  const { isLoggedIn } = useAuth();

  return (
    <div className={`min-h-screen flex items-center justify-center bg-base-200 ${styling.general.spacing}`}>
      <div className={`card w-full max-w-md px-4 bg-base-100 ${styling.shadows[1]} ${styling.roundness[1]} ${styling.borders[0]}`}>
        <div className="card-body py-8 items-center text-center">
          <div className="text-error mb-4">
            <SvgError className="size-16" />
          </div>
          <Title>
            Authentication Error
          </Title>
          <Paragraph className="mb-6">
            {message}
          </Paragraph>
          <div className="card-actions w-full flex flex-col">
            {error !== 'RateLimit' && (
              <Button
                href={isLoggedIn ? CALLBACK_URL : SIGNIN_URL}
                className="w-full"
              >
                {isLoggedIn ? "Go to dashboard" : "Try Again"}
              </Button>
            )}

            <div className="mx-auto mt-2">
              <ButtonBack
                className="btn-ghost btn-md! shadow-none!"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
