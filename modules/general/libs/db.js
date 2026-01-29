import { auth } from "@/modules/auth/libs/auth";
import connectMongo from "@/modules/general/libs/mongoose";
import { cleanObject } from "@/modules/general/libs/utils.server";
import User from "@/modules/general/models/User";

export async function getUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    await connectMongo();
    const userId = session.user.id;
    let user = await User.findById(userId).lean();

    if (!user) return null;

    return cleanObject(user);
  } catch (e) {
    console.error("getUser error:", e.message);
    return null;
  }
}
