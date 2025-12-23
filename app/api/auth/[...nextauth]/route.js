import { handlers } from "@/libs/auth";
import { checkRateLimit } from "@/libs/rateLimit";
import { NextResponse } from "next/server";

export const GET = handlers.GET;

export async function POST(req) {
  const url = new URL(req.url);

  if (url.pathname.includes("/signin/email") || url.pathname.includes("/signin/resend")) {
    const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";
    const { allowed } = await checkRateLimit(ip, "auth-magic-link", 1, 300);

    if (!allowed) {
      return NextResponse.json({ url: `${url.origin}/auth/error?error=RateLimit` });
    }
  }

  return handlers.POST(req);
}