import { handlers } from "@/libs/auth";
import { checkReqRateLimit } from "@/libs/rateLimit";
import { NextResponse } from "next/server";

export const GET = handlers.GET;

export async function POST(req) {
  const url = new URL(req.url);

  if (
    url.pathname.includes("/signin/email") ||
    url.pathname.includes("/signin/resend")
  ) {
    const response = await checkReqRateLimit(req, "auth-quick-link");
    if (response) {
      return NextResponse.json(
        { url: `${url.origin}/auth/error?error=RateLimit` },
        { status: 429 },
      );
    }
  }

  if (url.pathname.includes("/signin/google")) {
    const response = await checkReqRateLimit(req, "auth-google-signin");
    if (response) {
      return NextResponse.json(
        { url: `${url.origin}/auth/error?error=RateLimit` },
        { status: 429 },
      );
    }
  }

  return handlers.POST(req);
}
