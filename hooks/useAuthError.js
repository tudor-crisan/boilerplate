import { useSearchParams } from "next/navigation";

const errorMessages = {
  Configuration: "There is a problem with the server configuration. Check if your options are correct.",
  AccessDenied: "Access denied. You do not have permission to sign in.",
  Verification: "The sign in link is no longer valid. It may have been used already or it may have expired.",
  Default: "An unexpected authentication error occurred.",
  OAuthAccountNotLinked: "Google authentication not available for this account. Please sign-in with email address",
  RateLimit: "Too many requests. Please try again in a few minutes.",
  EmailValidation: "Please enter a valid email address."
};

export const useAuthError = () => {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  const message = error ? (errorMessages[error] || errorMessages.Default) : null;

  return { message, error };
};
