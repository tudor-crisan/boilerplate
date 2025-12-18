import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongo";
import { MagicLinkEmail } from "@/libs/email";

const config = {
  providers: [
    Resend({
      id: "email",
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_EMAIL_FROM,
      name: "email",
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { host } = new URL(url);
        const { subject, html, text } = MagicLinkEmail({ host, url });

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: email,
            subject,
            html,
            text,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(JSON.stringify(error));
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
