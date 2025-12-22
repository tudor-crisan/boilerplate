"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useStyling } from "@/context/ContextStyling";
import HeaderTop from "@/components/header/HeaderTop";
import SvgGoogle from "@/components/svg/SvgGoogle";
import Button from "@/components/button/Button";
import ButtonBack from "@/components/button/ButtonBack";
import { defaultSetting as settings } from "@/libs/defaults";

const CALLBACK_URL = "/dashboard"

export default function SignInPage() {
  const { styling } = useStyling();
  const [email, setEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

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
    <div className={`min-h-screen flex items-center justify-center bg-base-200 ${styling.general.spacing}`}>
      <div className={`card w-full max-w-sm bg-base-100 ${styling.shadows[1]} ${styling.roundness[1]} ${styling.borders[0]}`}>
        <div className="card-body">
          <div className="mx-auto mt-4 mb-8 scale-115 sm:scale-100">
            <HeaderTop url="/" />
          </div>
          {!settings.auth.providers.length && (
            <p className="text-center">No sign-in methods available at this time</p>
          )}
          {settings.auth.providers.includes("resend") && <>
            <form onSubmit={handleEmailSignIn} className="form-control gap-4">
              <div className="mb-2">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input
                  required
                  type="email"
                  placeholder="email@example.com"
                  className={`input input-bordered w-full ${styling.roundness[0]}`}
                  value={email}
                  disabled={loadingEmail || loadingGoogle}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                variant="btn-primary w-full"
                className="btn-md!"
                isLoading={loadingEmail}
                disabled={loadingEmail || loadingGoogle}
              >
                Sign in with Email
              </Button>
            </form>
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
              disabled={loadingEmail || loadingGoogle}
              startIcon={<SvgGoogle />}
            >
              Sign in with Google
            </Button>
          )}
          <div className="mx-auto mt-6">
            <ButtonBack
              className="btn-ghost btn-md! shadow-none!"
              disabled={loadingEmail || loadingGoogle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
