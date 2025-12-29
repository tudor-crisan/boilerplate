import { cache } from "react";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Board from "@/models/modules/boards/Board";

export async function getUser(populate = "") {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  await connectMongo();

  const userId = session.user.id;

  try {
    let user = await User.findById(userId).lean();

    if (!user) return null;

    if (populate && populate.includes("boards")) {
      const boards = await Board.find({ userId: userId }).sort({ createdAt: -1 });
      user.boards = boards;
    }

    return user;
  } catch (e) {
    return null;
  }
}

export const getBoardPrivate = cache(async (boardId) => {
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
});

export const getBoardPublic = cache(async (boardId) => {
  await connectMongo();

  try {
    return await Board.findById(boardId);
  } catch (e) {
    return null;
  }
});
