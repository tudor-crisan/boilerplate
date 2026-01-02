"use client";
import { useStyling } from "@/context/ContextStyling";
import SvgEmail from "@/components/svg/SvgEmail";
import ButtonBack from "@/components/button/ButtonBack";
import Title from "@/components/common/Title";
import Button from "@/components/button/Button";
import { useAuth } from "@/context/ContextAuth";

export default function VerifyRequestPage() {
  const { styling } = useStyling();
  const { isLoggedIn } = useAuth();

  return (
    <div className={`min-h-screen flex items-center justify-center bg-base-200 ${styling.general.padding}`}>
      <div className={`card w-full max-w-sm ${styling.components.card}`}>
        <div className={`card-body items-center text-center ${styling.general.padding}`}>
          {!isLoggedIn && (
            <div className="text-primary mx-auto my-4">
              <SvgEmail className="size-12" />
            </div>
          )}
          <Title>
            {isLoggedIn ? "You are logged in" : "Check your email"}
          </Title>
          <p className="text-base-content/70">
            {isLoggedIn ? "You are currently logged in. Go to your dashboard to manage your account." : "A sign-in link has been sent to your email address."}
          </p>
          <div className="mx-auto mt-4 w-full">
            {isLoggedIn ? (
              <Button href="/dashboard" className="w-full">
                Go to dashboard
              </Button>
            ) : (
              <ButtonBack
                className="btn-ghost btn-md! shadow-none!"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
