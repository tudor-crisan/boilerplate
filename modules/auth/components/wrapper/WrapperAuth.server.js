import WrapperAuthClient from "@/modules/auth/components/wrapper/WrapperAuth.client";
import { auth } from "@/modules/auth/libs/auth";
import { getEmailHandle, getNameInitials } from "@/modules/general/libs/utils.client";

export default async function WrapperAuth({ children }) {
  const sessionAuth = await auth();
  const authSession = {
    isLoggedIn: !!sessionAuth?.user,
  };

  if (authSession.isLoggedIn) {
    const name =
      sessionAuth.user.name || getEmailHandle(sessionAuth.user.email, "friend");

    Object.assign(authSession, {
      hasAccess: sessionAuth.user.hasAccess,
      id: sessionAuth.user.id,
      email: sessionAuth.user.email,
      name: name,
      initials: getNameInitials(name),
      image: sessionAuth.user.image,
      styling: sessionAuth.user.styling,
    });
  }

  return (
    <WrapperAuthClient authSession={authSession}>{children}</WrapperAuthClient>
  );
}
