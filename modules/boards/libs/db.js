import { auth } from "@/modules/auth/libs/auth";
import Board from "@/modules/boards/models/Board";
import Post from "@/modules/boards/models/Post";
import connectMongo from "@/modules/general/libs/mongoose";
import { cleanObject } from "@/modules/general/libs/utils.server";
import User from "@/modules/general/models/User";
import { cache } from "react";
import mongoose from "mongoose";

const getPostsAggregation = async (boardId) => {
  return await Post.aggregate([
    {
      $match: {
        boardId: mongoose.Types.ObjectId.isValid(boardId)
          ? new mongoose.Types.ObjectId(boardId)
          : boardId,
      },
    },
    {
      $lookup: {
        from: "comments",
        let: { postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$postId", "$$postId"] },
              isDeleted: { $ne: true },
            },
          },
        ],
        as: "comments",
      },
    },
    {
      $addFields: {
        commentsCount: { $size: "$comments" },
      },
    },

    {
      $sort: {
        votesCounter: -1,
        createdAt: -1,
      },
    },
  ]);
};

const serializePosts = (posts) => {
  return posts.map((post) => ({
    ...post,
    _id: post._id.toString(),
    boardId: post.boardId.toString(),
    userId: post.userId ? post.userId.toString() : null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));
};

export async function getUser(populate = "") {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    await connectMongo();
    const userId = session.user.id;
    let user = await User.findById(userId).lean();

    if (!user) return null;

    if (populate && populate.includes("boards")) {
      const boards = await Board.find({ userId: userId })
        .sort({ createdAt: -1 })
        .lean();
      user.boards = boards;
    }

    return cleanObject(user);
  } catch (e) {
    console.error("getUser error:", e.message);
    return null;
  }
}

export const getBoardPrivate = cache(async (boardId, populate = "") => {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    await connectMongo();
    const query = { userId: session.user.id };
    if (mongoose.Types.ObjectId.isValid(boardId)) {
      query._id = boardId;
    } else {
      query.slug = boardId;
    }
    const board = await Board.findOne(query).lean();

    if (!board) return null;

    if (populate && populate.includes("posts")) {
      const posts = await getPostsAggregation(board._id);
      board.posts = serializePosts(posts);
    }

    return cleanObject(board);
  } catch (e) {
    console.error("getBoardPrivate error:", e.message);
    return null;
  }
});

export const getBoardPublic = cache(async (boardId, populate = "") => {
  try {
    await connectMongo();
    let query = {};
    if (mongoose.Types.ObjectId.isValid(boardId)) {
      query._id = boardId;
    } else {
      query.slug = boardId;
    }
    const board = await Board.findOne(query).lean();

    if (!board) return null;

    if (populate && populate.includes("posts")) {
      const posts = await getPostsAggregation(board._id);
      board.posts = serializePosts(posts);
    }

    return cleanObject(board);
  } catch (e) {
    console.error("getBoardPublic error:", e.message);
    return null;
  }
});

export const getPosts = async (boardId) => {
  try {
    await connectMongo();
    const posts = await getPostsAggregation(boardId);
    return cleanObject(serializePosts(posts));
  } catch (e) {
    console.error("getPosts error:", e.message);
    return [];
  }
};
