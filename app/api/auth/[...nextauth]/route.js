import { handlers } from "@/libs/auth";
import { checkReqRateLimit } from "@/libs/rateLimit";

export const GET = handlers.GET;

export async function POST(req) {
  const url = new URL(req.url);

  if (url.pathname.includes("/signin/email") || url.pathname.includes("/signin/resend")) {
    const error = await checkReqRateLimit(req, "auth-magic-link");
    if (error) return error;
  }

  if (url.pathname.includes("/signin/google")) {
    const error = await checkReqRateLimit(req, "auth-google-signin");
    if (error) return error;
  }

  return handlers.POST(req);
}