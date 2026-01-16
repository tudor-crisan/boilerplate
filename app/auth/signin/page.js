"use client";
import { useState, Suspense, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
import { useError } from "@/hooks/useError";
import Error from "@/components/common/Error";
import Divider from "@/components/common/Divider";
import { useAuth } from "@/context/ContextAuth";
import FooterAuth from "@/components/footer/FooterAuth";

const CALLBACK_URL = settings.paths.dashboard.source;

function SignInContent() {
  const { styling } = useStyling();
  const { message } = useAuthError();
  const { isLoggedIn } = useAuth();
  const { error: errorMessage, clearError } = useError(message);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const disabled = loadingEmail || loadingGoogle || isLoggedIn;

  useEffect(() => {
    if (isLoggedIn) {
      toast.success("You're already logged in. Redirecting...");

      const timer = setTimeout(() => {
        router.push(CALLBACK_URL);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, router]);

  const handleSignIn = async (provider, options, setLoading) => {
    setLoading(true);
    try {
      const res = await signIn(provider, { ...options, callbackUrl: CALLBACK_URL, redirect: false });

      if (res?.error) {
        setLoading(false);
        router.push(`/auth/error?error=${res.error}`);
      } else if (res?.url) {
        window.location.href = res.url;
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    await handleSignIn("email", { email }, setLoadingEmail);
  };

  const handleGoogleSignIn = async () => {
    await handleSignIn("google", {}, setLoadingGoogle);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - content */}
      <div
        className={`w-full ${styling.flex.center} bg-base-200 ${styling.general.box} flex-col`}
        onFocusCapture={clearError}
        onClickCapture={clearError}
      >
        <div className={`card w-full max-w-sm ${styling.components.card}`}>
          <div className={`card-body ${styling.general.box}`}>
            <div className="mx-auto mt-4 mb-8 scale-115 sm:scale-100">
              <HeaderTop url={disabled ? "" : settings.paths.home.source} />
            </div>

            <Error message={errorMessage} />

            {!settings.auth.providers.length && (
              <p className="text-center">No sign-in methods available at this time</p>
            )}
            {settings.auth.providers.includes("resend") && <>
              <Form onSubmit={handleEmailSignIn} className="space-y-3">
                <div className="space-y-1">
                  <Label>
                    Email Address
                  </Label>
                  <Input
                    required
                    type="email"
                    placeholder="email@example.com"
                    className={styling.components.input}
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
                <Divider />
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
        {settings.auth.providers.length > 0 && (
          <FooterAuth />
        )}
      </div>
    </div>

  );
}

export default function SignInPage() {
  const { styling } = useStyling();
  return (
    <Suspense fallback={(
      <div className={`min-h-screen ${styling.flex.center}`}>
        Loading...
      </div>
    )}>
      <SignInContent />
    </Suspense>
  );
}
