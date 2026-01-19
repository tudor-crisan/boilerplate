import { responseSuccess, responseError } from "@/libs/utils.server";
import { defaultSetting as settings } from "@/libs/defaults";
import mongoose from "mongoose";
import Post from "@/models/modules/boards/Post";
import Board from "@/models/modules/boards/Board";
import { Filter } from "bad-words";
import { trackEvent, createNotification } from "@/libs/modules/boards/analytics";
import { withApiHandler } from "@/libs/apiHandler";

const TYPE = "Post";

export const POST = withApiHandler(async (req, { session }) => {
  if (!settings.forms?.[TYPE]) {
    throw new Error("Missing settings for " + TYPE);
  }

  const {
    titleRequired,
    descriptionRequired,
    boardIdRequired,
    createSuccesfully,
  } = settings.forms[TYPE].backend.responses;

  const { searchParams } = req.nextUrl;
  let boardId = searchParams.get("boardId");

  if (!boardId) {
    return responseError(boardIdRequired.message, {}, boardIdRequired.status);
  }

  const body = await req.json();

  if (!body.title) {
    return responseError(titleRequired.message, titleRequired.inputErrors, titleRequired.status);
  }

  if (!body.description) {
    return responseError(descriptionRequired.message, descriptionRequired.inputErrors, descriptionRequired.status);
  }

  const filter = new Filter();
  const cleanTitle = filter.clean(body.title);
  const cleanDescription = filter.clean(body.description);

  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    const board = await Board.findOne({ slug: boardId });
    if (board) {
      boardId = board._id;
    }
  }

  const userId = session?.user?.id;

  const postData = {
    title: cleanTitle,
    description: cleanDescription,
    boardId: boardId,
  };

  if (userId) {
    postData.userId = userId;
  }

  const clientId = req.headers.get("x-client-id");
  if (clientId) {
    postData.lastActionByClientId = clientId;
  }

  const post = await Post.create(postData);

  // Analytics & Notifications
  await trackEvent(boardId, "POST");
  await createNotification(boardId, "POST", {
    postId: post._id,
    postTitle: post.title,
  });

  return responseSuccess(createSuccesfully.message, { post }, createSuccesfully.status);
}, { type: TYPE, rateLimitKey: "post-create", needAuth: false, needAccess: false });

export const DELETE = withApiHandler(async (req, { user }) => {
  const {
    postIdRequired,
    postNotFound,
    deleteSuccesfully,
  } = settings.forms[TYPE].backend.responses;

  const { searchParams } = req.nextUrl;
  const postId = searchParams.get("postId");

  if (!postId) {
    return responseError(postIdRequired.message, {}, postIdRequired.status);
  }

  const post = await Post.findById(postId);
  if (!post) {
    return responseError(postNotFound.message, {}, postNotFound.status);
  }

  const board = await Board.findById(post.boardId);
  if (!board) {
    return responseError("Unauthorized", {}, 401);
  }

  // check if the person deleting the post is the owner of the board
  if (board.userId.toString() !== user._id.toString()) {
    return responseError("Unauthorized", {}, 401);
  }

  await Post.deleteOne({ _id: postId });

  return responseSuccess(deleteSuccesfully.message, {}, deleteSuccesfully.status);
}, { type: TYPE, rateLimitKey: "post-delete" });

export const GET = withApiHandler(async (req) => {
  const { searchParams } = req.nextUrl;
  let boardId = searchParams.get("boardId");

  if (!boardId) {
    const { boardIdRequired } = settings.forms[TYPE].backend.responses;
    return responseError(boardIdRequired.message, {}, boardIdRequired.status);
  }

  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    const board = await Board.findOne({ slug: boardId });
    if (board) {
      boardId = board._id;
    }
  }

  const posts = await Post.aggregate([
    { $match: { boardId: boardId } },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments"
      }
    },
    {
      $addFields: {
        commentsCount: {
          $size: {
            $filter: {
              input: "$comments",
              as: "comment",
              cond: { $ne: ["$$comment.isDeleted", true] }
            }
          }
        }
      }
    },
    { $project: { comments: 0 } },
    { $sort: { votesCounter: -1, createdAt: -1 } }
  ]);

  return responseSuccess("Posts fetched successfully", { posts }, 200);
}, { type: TYPE, needAuth: false, needAccess: false });
