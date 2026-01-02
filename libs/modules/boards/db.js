import { cache } from "react";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Board from "@/models/modules/boards/Board";
import Post from "@/models/modules/boards/Post";
import { cleanObject } from "@/libs/utils.server";

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
      const boards = await Board.find({ userId: userId }).sort({ createdAt: -1 }).lean();
      user.boards = boards;
    }

    return cleanObject(user);
  } catch (e) {
    return null;
  }
}

export const getBoardPrivate = cache(async (boardId, populate = "") => {
  const session = await auth();
  await connectMongo();

  try {
    const board = await Board.findOne({
      _id: boardId,
      userId: session?.user?.id
    }).lean();

    if (!board) return null;

    if (populate && populate.includes("posts")) {
      const posts = await Post.find({ boardId: board._id }).sort({ votesCounter: -1, createdAt: -1 }).lean();
      board.posts = posts;
    }

    return cleanObject(board);
  } catch (e) {
    return null;
  }
});

export const getBoardPublic = cache(async (boardId, populate = "") => {
  await connectMongo();

  try {
    const board = await Board.findById(boardId).lean();

    if (!board) return null;

    if (populate && populate.includes("posts")) {
      const posts = await Post.find({ boardId: board._id }).sort({ votesCounter: -1, createdAt: -1 }).lean();
      board.posts = posts;
    }

    return cleanObject(board);
  } catch (e) {
    return null;
  }
});

export const getPosts = async (boardId) => {
  await connectMongo();

  try {
    const posts = await Post.find({ boardId })
      .sort({ votesCounter: -1, createdAt: -1 })
      .lean();

    return cleanObject(posts);
  } catch (e) {
    return [];
  }
};
