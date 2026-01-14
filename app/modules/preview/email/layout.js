import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default async function Layout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
