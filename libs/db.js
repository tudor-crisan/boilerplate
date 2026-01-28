import connectMongo from "@/libs/mongoose";
import { cleanObject } from "@/libs/utils.server";
import User from "@/models/User";
import { auth } from "@/modules/auth/libs/auth";

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
