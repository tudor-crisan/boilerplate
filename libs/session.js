
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Board from "@/models/Board";

export async function getUser(populate = "") {
  const session = await auth();
  const userId = session.user.id;

  const findById = () => {
    return User.findById(userId);
  }

  await connectMongo();

  if (populate) {
    return await findById().populate(populate);
  }

  return await findById();
}