"use client";
import { useStyling } from "@/context/ContextStyling";
import SvgEmail from "@/components/svg/SvgEmail";
import LinkBack from "@/components/links/LinkBack";

export default function VerifyRequestPage() {
  const { styling } = useStyling();

  return (
    <div className={`min-h-screen flex items-center justify-center ${styling.general.spacing}`}>
      <div className={`card w-full max-w-sm bg-base-100 ${styling.shadows[1]} ${styling.roundness[1]} ${styling.borders[0]}`}>
        <div className="card-body py-8 items-center text-center">
          <div className="text-primary mx-auto my-4">
            <SvgEmail className="size-10" />
          </div>
          <h2 className="card-title text-xl sm:text-2xl font-bold mb-2">Check your email</h2>
          <p className="text-base-content/70">
            A sign-in link has been sent to your email address.
          </p>
          <LinkBack className="mt-6" />
        </div>
      </div>
    </div>
  );
}
