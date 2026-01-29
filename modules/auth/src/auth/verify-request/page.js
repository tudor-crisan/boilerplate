"use client";
import PagesAuth from "@/modules/auth/components/pages/PagesAuth";
import ButtonBack from "@/modules/general/components/button/ButtonBack";
import SvgEmail from "@/modules/general/components/svg/SvgEmail";

export default function VerifyRequestPage() {
  return (
    <PagesAuth
      title="Check your email"
      description="A sign-in link has been sent to your email address."
      icon={<SvgEmail className="size-12 text-primary" />}
      maxWidth="max-w-sm"
    >
      <div className="mx-auto w-full">
        <ButtonBack className="btn-ghost btn-md! shadow-none!" />
      </div>
    </PagesAuth>
  );
}
