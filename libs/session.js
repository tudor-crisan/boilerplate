
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function getUser(populate = "") {
  const session = await auth();
  const userId = session.user.id;

  let request = User.findById(userId);

  if (populate) {
    request.populate(populate);
  }

  await connectMongo();
  return await request;
}