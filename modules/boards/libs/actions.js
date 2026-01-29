"use server";

import Post from "@/modules/boards/models/Post";
import connectMongo from "@/modules/general/libs/mongoose";
import { cleanObject } from "@/modules/general/libs/utils.server";

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
