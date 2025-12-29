import { handlers } from "@/libs/auth";
import { checkRateLimit } from "@/libs/rateLimit";
import { NextResponse } from "next/server";
import { defaultSetting as settings } from "@/libs/defaults";

export const GET = handlers.GET;

export async function POST(req) {
  const url = new URL(req.url);
  const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";

  if (url.pathname.includes("/signin/email") || url.pathname.includes("/signin/resend")) {
    const type = "auth-magic-link";
    const config = settings.rateLimits?.[type] || { limit: 5, window: 300 };
    const { allowed } = await checkRateLimit(ip, type, config.limit, config.window);

    if (!allowed) {
      return NextResponse.json({ url: `${url.origin}/auth/error?error=RateLimit` });
    }
  }

  if (url.pathname.includes("/signin/google")) {
    const type = "auth-google-signin";
    const config = settings.rateLimits?.[type] || { limit: 10, window: 60 };
    const { allowed } = await checkRateLimit(ip, type, config.limit, config.window);

    if (!allowed) {
      return NextResponse.json({ url: `${url.origin}/auth/error?error=RateLimit` });
    }
  }

  return handlers.POST(req);
}