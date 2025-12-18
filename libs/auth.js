import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongo";

const config = {
  providers: [
    Resend({
      id: "email",
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_EMAIL_FROM,
      name: "email",
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { host } = new URL(url);
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: email,
            subject: `Sign in to ${host}`,
            html: `
              <div style="background-color: #f9fafb; padding: 40px 0; font-family: sans-serif;">
                <div style="max-width: 400px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="font-size: 24px; font-weight: bold; margin: 0;">LoyalBoards</h1>
                  </div>
                  <div style="text-align: center; margin-bottom: 32px;">
                    <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">Sign in to ${host}</h2>
                    <a href="${url}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 500;">Sign in</a>
                  </div>
                  <p style="font-size: 14px; color: #6b7280; text-align: center; margin: 0;">
                    If you did not request this email you can safely ignore it.
                  </p>
                </div>
              </div>
            `,
            text: `Sign in to ${host}\n${url}\n\nIf you did not request this email you can safely ignore it.`,
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
