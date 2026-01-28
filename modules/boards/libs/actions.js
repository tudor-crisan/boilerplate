"use server";

import connectMongo from "@/libs/mongoose";
import { cleanObject } from "@/libs/utils.server";
import Post from "@/modules/boards/models/Post";

export const getPosts = async (boardId) => {
  await connectMongo();

  try {
    const posts = await Post.find({ boardId })
      .sort({ votesCounter: -1, createdAt: -1 })
      .lean();

    return cleanObject(posts);
  } catch {
    return [];
  }
};
