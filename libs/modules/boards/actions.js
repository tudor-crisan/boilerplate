"use server";

import connectMongo from "@/libs/mongoose";
import Post from "@/models/modules/boards/Post";
import { cleanObject } from "@/libs/utils.server";

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
