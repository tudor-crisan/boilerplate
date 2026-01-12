import { auth } from "@/libs/auth";
import { getEmailHandle, getNameInitials } from "@/libs/utils.client";
import WrapperAuthClient from "@/components/wrapper/WrapperAuth.client";

export default async function WrapperAuth({ children }) {
  const sessionAuth = await auth();
  const authSession = {
    "isLoggedIn": !!sessionAuth?.user
  }

  if (authSession.isLoggedIn) {
    const name = sessionAuth.user.name || getEmailHandle(sessionAuth.user.email, "friend");

    Object.assign(authSession, {
      "hasAccess": sessionAuth.user.hasAccess,
      "id": sessionAuth.user.id,
      "email": sessionAuth.user.email,
      "name": name,
      "initials": getNameInitials(name),
      "image": sessionAuth.user.image,
      "styling": sessionAuth.user.styling,
    });

  }

  return (
    <WrapperAuthClient authSession={authSession}>
      {children}
    </WrapperAuthClient>
  );
}
