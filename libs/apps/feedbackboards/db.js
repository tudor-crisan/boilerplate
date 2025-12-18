
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/apps/feedbackboards/mongoose";
import User from "@/models/apps/feedbackboards/User";
import Board from "@/models/apps/feedbackboards/Board";

export async function getUser(populate = "") {
  const session = await auth();
  await connectMongo();

  const userId = session.user.id;
  let request = User.findById(userId);

  if (populate) {
    request.populate(populate);
  }

  try {
    return await request;
  } catch (e) {
    return null;
  }
}

export async function getBoardPrivate(boardId) {
  const session = await auth();
  await connectMongo();

  try {
    return await Board.findOne({
      _id: boardId,
      userId: session?.user?.id
    });
  } catch (e) {
    return null;
  }
}

export async function getBoardPublic(boardId) {
  await connectMongo();

  try {
    return await Board.findById(boardId);
  } catch (e) {
    return null;
  }
}
