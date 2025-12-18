"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useStyling } from "@/context/ContextStyling";
import HeaderTop from "@/components/header/HeaderTop";
import SvgGoogle from "@/components/svg/SvgGoogle";
import LinkBack from "@/components/links/LinkBack";

export default function SignInPage() {
  const { styling } = useStyling();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn("email", { email, callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${styling.general.spacing}`}>
      <div className={`card w-full max-w-sm bg-base-100 ${styling.shadows[1]} ${styling.roundness[1]} ${styling.borders[0]}`}>
        <div className="card-body">
          <div className="mx-auto mt-4 mb-8 scale-115 sm:scale-100">
            <HeaderTop />
          </div>
          <form onSubmit={handleEmailSignIn} className="form-control gap-4">
            <div className="mb-2">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className={`input input-bordered w-full ${styling.roundness[0]}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={`btn btn-primary w-full ${styling.roundness[0]}`}
              disabled={isLoading}
            >
              {isLoading ? <span className="loading loading-spinner"></span> : "Sign in with Email"}
            </button>
          </form>
          <div className="divider">OR</div>
          <button
            onClick={handleGoogleSignIn}
            className={`btn btn-outline w-full flex gap-2 ${styling.roundness[0]}`}
          >
            <SvgGoogle />
            Sign in with Google
          </button>
          <LinkBack className="mt-6" />
        </div>
      </div>
    </div>
  );
}
