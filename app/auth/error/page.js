"use client";

import { useSearchParams } from "next/navigation";
import { useStyling } from "@/context/ContextStyling";
import Link from "next/link";
import { Suspense } from "react";
import SvgError from "@/components/svg/SvgError";
import LinkBack from "@/components/links/LinkBack";

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
    <div className={`min-h-screen flex items-center justify-center ${styling.general.spacing}`}>
      <div className={`card w-full max-w-md px-4 bg-base-100 ${styling.shadows[1]} ${styling.roundness[1]} ${styling.borders[0]}`}>
        <div className="card-body py-8 items-center text-center">
          <div className="text-error mb-4">
            <SvgError className="size-16" />
          </div>
          <h2 className="card-title text-2xl font-bold mb-2">Authentication Error</h2>
          <p className="mb-6">{message}</p>
          <div className="card-actions w-full flex flex-col">
            <Link href="/auth/signin" className={`btn btn-primary w-full ${styling.roundness[0]}`}>
              Try Again
            </Link>
            <LinkBack className="mt-2" />
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
