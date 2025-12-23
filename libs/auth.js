import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongo";
import { MagicLinkEmail } from "@/libs/email";
import { defaultSetting as settings } from "@/libs/defaults";
import { sendEmail } from "@/libs/api";
import { headers } from "next/headers";
import { checkRateLimit } from "@/libs/rateLimit";

const providersConfig = {
  resend: () => Resend({
    id: "email",
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.RESEND_EMAIL_FROM,
    name: "email",
    ...(settings.auth.hasThemeEmails && {
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const headersList = headers();
        const ip = headersList.get("x-forwarded-for") || "0.0.0.0";
        const { allowed, message } = await checkRateLimit(ip, "auth-magic-link", 5, 300);

        if (!allowed) {
          throw new Error(message || "Too many requests");
        }

        const { host } = new URL(url);
        const { subject, html, text } = await MagicLinkEmail({ host, url });

        sendEmail({
          apiKey: provider.apiKey,
          from: provider.from,
          email, subject, html, text
        })
      }
    })
  }),
  google: () => Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  })
}

const getProviders = () => {
  if (!settings.auth.providers.length) {
    return [];
  }

  return settings.auth.providers.map(provider => {
    return providersConfig[provider]()
  });
}

const getPages = () => {
  if (settings.auth.hasThemePages) {
    return {
      signIn: "/auth/signin",
      verifyRequest: "/auth/verify-request",
      error: "/auth/error",
    }
  }

  return {};
}

const config = {
  providers: getProviders(),
  adapter: MongoDBAdapter(clientPromise),
  pages: getPages()
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
