"use client";
import { useSearchParams } from "next/navigation";
import { useStyling } from "@/context/ContextStyling";
import { Suspense } from "react";
import Link from "next/link";
import SvgError from "@/components/svg/SvgError";
import ButtonBack from "@/components/button/ButtonBack";
import GeneralTitle from "@/components/general/GeneralTitle";

function ErrorContent() {
  const { styling } = useStyling();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages = {
    Configuration: "There is a problem with the server configuration. Check if your options are correct.",
    AccessDenied: "Access denied. You do not have permission to sign in.",
    Verification: "The sign in link is no longer valid. It may have been used already or it may have expired.",
    Default: "An unexpected authentication error occurred."
  };

  const message = errorMessages[error] || errorMessages.Default;

  return (
    <div className={`min-h-screen flex items-center justify-center bg-base-200 ${styling.general.spacing}`}>
      <div className={`card w-full max-w-md px-4 bg-base-100 ${styling.shadows[1]} ${styling.roundness[1]} ${styling.borders[0]}`}>
        <div className="card-body py-8 items-center text-center">
          <div className="text-primary mb-4">
            <SvgError className="size-16" />
          </div>
          <GeneralTitle>
            Authentication Error
          </GeneralTitle>
          <p className="mb-6">{message}</p>
          <div className="card-actions w-full flex flex-col">
            <Link
              href="/auth/signin"
              className={`${styling.roundness[0]} ${styling.shadows[0]} btn btn-primary w-full`}
            >
              Try Again
            </Link>
            <div className="mx-auto mt-6">
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
