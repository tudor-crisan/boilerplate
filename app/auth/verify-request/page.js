"use client";
import SvgEmail from "@/components/svg/SvgEmail";
import ButtonBack from "@/components/button/ButtonBack";
import PagesAuth from "@/components/pages/PagesAuth";

export default function VerifyRequestPage() {
  return (
    <PagesAuth
      title="Check your email"
      description="A sign-in link has been sent to your email address."
      icon={<SvgEmail className="size-12 text-primary" />}
      maxWidth="max-w-sm"
    >
      <div className="mx-auto w-full">
        <ButtonBack
          className="btn-ghost btn-md! shadow-none!"
        />
      </div>
    </PagesAuth>
  );
}
