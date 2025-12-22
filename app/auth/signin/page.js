"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useStyling } from "@/context/ContextStyling";
import HeaderTop from "@/components/header/HeaderTop";
import SvgGoogle from "@/components/svg/SvgGoogle";
import ButtonBack from "@/components/button/ButtonBack";
import IconLoading from "@/components/icon/IconLoading";
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
              <button
                type="submit"
                className={`${styling.roundness[0]} ${styling.shadows[0]} btn btn-primary w-full`}
                disabled={loadingEmail || loadingGoogle}
              >
                {loadingEmail && <IconLoading />}
                Sign in with Email
              </button>
            </form>
            {settings.auth.providers.length > 1 && (
              <div className="divider">OR</div>
            )}
          </>}
          {settings.auth.providers.includes("google") && (
            <button
              onClick={handleGoogleSignIn}
              className={`${styling.roundness[0]} ${styling.shadows[0]} btn btn-outline w-full`}
              disabled={loadingEmail || loadingGoogle}
            >
              {loadingGoogle ? <IconLoading /> : <SvgGoogle />}
              Sign in with Google
            </button>
          )}
          <div className="mx-auto mt-6">
            <ButtonBack
              url="/"
              disabled={loadingEmail || loadingGoogle}
              className="btn-md! btn-ghost"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
