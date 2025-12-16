import { auth } from "@/libs/auth";
import WrapperAuthClient from "./WrapperAuth.client";

export default async function WrapperAuth({ children }) {
  const sessionAuth = await auth();
  const authSession = {
    isLoggedIn: !!sessionAuth?.user
  }

  return (
    <WrapperAuthClient authSession={authSession}>
      {children}
    </WrapperAuthClient>
  );
}
