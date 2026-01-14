import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongo";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import { QuickLinkEmail, sendEmail } from "@/libs/email";
import { defaultSetting as settings } from "@/libs/defaults";

import { validateEmail } from "@/libs/utils.server";

const providersConfig = {
  resend: () => Resend({
    id: "email",
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.RESEND_EMAIL_FROM,
    name: "email",
    ...(settings.auth.hasThemeEmails && {
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { host } = new URL(url);
        let styling;
        try {
          await connectMongo();
          const user = await User.findOne({ email });
          if (user && user.styling) {
            styling = user.styling;
          }
        } catch (e) {
          console.error("Error fetching user styling for email:", e);
        }
        const { subject, html, text } = await QuickLinkEmail({ host, url, styling });

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
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user?.email) {
        const { isValid, error } = validateEmail(user.email);
        if (!isValid) {
          console.warn(`Blocked sign-in attempt for invalid email: ${user.email}. Reason: ${error}`);
          return `/auth/error?error=EmailValidation`;
        }
      }
      return true;
    },
    async session({ session, user, token }) {
      if (session?.user && user?.styling) {
        session.user.styling = user.styling;
      }
      return session;
    },
  },
  ...(clientPromise && { adapter: MongoDBAdapter(clientPromise) }),
  pages: getPages()
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
