"use client";
import { useState, Suspense, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useStyling } from "@/context/ContextStyling";
import HeaderTop from "@/components/header/HeaderTop";
import SvgGoogle from "@/components/svg/SvgGoogle";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import ButtonBack from "@/components/button/ButtonBack";
import { defaultSetting as settings } from "@/libs/defaults";
import Label from "@/components/common/Label";
import Form from "@/components/common/Form";
import { useAuthError } from "@/hooks/useAuthError";
import Error from "@/components/common/Error";

const CALLBACK_URL = "/dashboard"

function SignInContent() {
  const { styling } = useStyling();
  const { message } = useAuthError();
  const [errorMessage, setErrorMessage] = useState(null);
  const [email, setEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const disabled = loadingEmail || loadingGoogle;

  useEffect(() => {
    setErrorMessage(message);
  }, [message]);

  const clearError = () => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoadingEmail(true);
    try {
      await signIn("email", { email, callbackUrl: CALLBACK_URL });
    } catch (error) {
      console.error(error);
      setLoadingEmail(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    try {
      await signIn("google", { callbackUrl: CALLBACK_URL });
    } catch (error) {
      console.error(error);
      setLoadingGoogle(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-base-200 ${styling.general.spacing}`}
      onFocusCapture={clearError}
      onClickCapture={clearError}
    >
      <div className={`card w-full max-w-sm bg-base-100 ${styling.shadows[1]} ${styling.roundness[1]} ${styling.borders[0]}`}>
        <div className="card-body">
          <div className="mx-auto mt-4 mb-8 scale-115 sm:scale-100">
            <HeaderTop url="/" />
          </div>

          <Error message={errorMessage} />

          {!settings.auth.providers.length && (
            <p className="text-center">No sign-in methods available at this time</p>
          )}
          {settings.auth.providers.includes("resend") && <>
            <Form onSubmit={handleEmailSignIn} className="gap-4">
              <div className="mb-2">
                <Label>
                  <span>Email Address</span>
                </Label>
                <Input
                  required
                  type="email"
                  placeholder="email@example.com"
                  className={`input-bordered w-full`}
                  value={email}
                  disabled={disabled}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                variant="btn-primary w-full"
                className="btn-md!"
                isLoading={loadingEmail}
                disabled={disabled}
              >
                Sign in with Email
              </Button>
            </Form>
            {settings.auth.providers.length > 1 && (
              <div className="divider">OR</div>
            )}
          </>}
          {settings.auth.providers.includes("google") && (
            <Button
              onClick={handleGoogleSignIn}
              variant="btn-outline w-full"
              className="btn-md!"
              isLoading={loadingGoogle}
              disabled={disabled}
              startIcon={<SvgGoogle />}
            >
              Sign in with Google
            </Button>
          )}
          <div className="mx-auto mt-4">
            <ButtonBack
              className="btn-ghost btn-md! shadow-none!"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
