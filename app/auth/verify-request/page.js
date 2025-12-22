"use client";
import { useStyling } from "@/context/ContextStyling";
import SvgEmail from "@/components/svg/SvgEmail";
import ButtonBack from "@/components/button/ButtonBack";
import GeneralTitle from "@/components/general/GeneralTitle";

export default function VerifyRequestPage() {
  const { styling } = useStyling();

  return (
    <div className={`min-h-screen flex items-center justify-center bg-base-200 ${styling.general.spacing}`}>
      <div className={`card w-full max-w-sm bg-base-100 ${styling.shadows[1]} ${styling.roundness[1]} ${styling.borders[0]}`}>
        <div className="card-body py-8 items-center text-center">
          <div className="text-primary mx-auto my-4">
            <SvgEmail className="size-12" />
          </div>
          <GeneralTitle>
            Check your email
          </GeneralTitle>
          <p className="text-base-content/70">
            A sign-in link has been sent to your email address.
          </p>
          <div className="mx-auto mt-6">
            <ButtonBack
              className="btn-ghost btn-md! shadow-none!"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
