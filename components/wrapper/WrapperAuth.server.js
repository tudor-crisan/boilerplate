import { auth } from "@/libs/auth";
import WrapperAuthClient from "./WrapperAuth.client";

export default async function WrapperAuth({ children }) {
  const sessionAuth = await auth();
  const authSession = {
    isLoggedIn: !!sessionAuth?.user
  }

  if (authSession.isLoggedIn) {
    authSession.email = sessionAuth.user.email;
    authSession.name = sessionAuth.user.name || authSession.email;
    authSession.initials = authSession.name.slice(0, 2).toUpperCase();
  }

  return (
    <WrapperAuthClient authSession={authSession}>
      {children}
    </WrapperAuthClient>
  );
}
