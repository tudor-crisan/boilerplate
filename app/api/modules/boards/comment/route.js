import { responseSuccess, responseError } from "@/libs/utils.server";
import { defaultSetting as settings } from "@/libs/defaults";
import Board from "@/models/modules/boards/Board";
import Comment from "@/models/modules/boards/Comment";
import Post from "@/models/modules/boards/Post";
import { Filter } from "bad-words";
import { trackEvent, createNotification } from "@/libs/modules/boards/analytics";
import { withApiHandler } from "@/libs/apiHandler";
import { auth } from "@/libs/auth";

const TYPE = "Comment";

export const POST = withApiHandler(async (req) => {
  if (!settings.forms?.[TYPE]) {
    throw new Error("Missing settings for " + TYPE);
  }

  const {
    textRequired,
    nameRequired,
    postIdRequired,
    createSuccesfully,
    commentNotFound,
  } = settings.forms[TYPE].backend.responses;

  const body = await req.json();

  if (!body.postId) {
    return responseError(postIdRequired.message, {}, postIdRequired.status);
  }

  if (!body.text) {
    return responseError(textRequired.message, textRequired.inputErrors, textRequired.status);
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId && !body.name) {
    return responseError(nameRequired.message, nameRequired.inputErrors, nameRequired.status);
  }

  const post = await Post.findById(body.postId);
  if (!post) {
    return responseError(commentNotFound.message, {}, commentNotFound.status);
  }

  const filter = new Filter();
  const cleanText = filter.clean(body.text);

  const commentData = {
    text: cleanText,
    postId: body.postId,
    boardId: post.boardId,
  };

  if (userId) {
    commentData.userId = userId;
  } else {
    commentData.name = filter.clean(body.name);
  }

  const comment = await Comment.create(commentData);

  // Analytics & Notifications
  await trackEvent(post.boardId, "COMMENT");
  await createNotification(post.boardId, "COMMENT", {
    postId: post._id,
    commentId: comment._id,
    commentText: comment.text.substring(0, 50),
    postTitle: post.title
  });

  if (userId) {
    await comment.populate("userId", "name image email");
  }
  await comment.populate("boardId");

  return responseSuccess(createSuccesfully.message, { comment }, createSuccesfully.status);
}, { type: TYPE, rateLimitKey: "comment-create", needAuth: false, needAccess: false });

export const DELETE = withApiHandler(async (req, { session }) => {
  const {
    deleteSuccesfully,
    commentNotFound
  } = settings.forms[TYPE].backend.responses;

  const { searchParams } = req.nextUrl;
  const commentId = searchParams.get("commentId");

  if (!commentId) {
    return responseError(commentNotFound.message, {}, commentNotFound.status);
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return responseError(commentNotFound.message, {}, commentNotFound.status);
  }

  const userId = session?.user?.id;
  let canDelete = false;

  if (userId && comment.userId && comment.userId.toString() === userId) {
    canDelete = true;
  } else if (userId) {
    const board = await Board.findById(comment.boardId);
    if (board && board.userId.toString() === userId) {
      canDelete = true;
    }
  } else if (!comment.userId) {
    // Anonymous comment - allow deletion if they have the ID
    canDelete = true;
  }

  if (!canDelete) {
    return responseError("Unauthorized", {}, 401);
  }

  await Comment.updateOne({ _id: commentId }, { $set: { isDeleted: true } });

  return responseSuccess(deleteSuccesfully.message, {}, deleteSuccesfully.status);
}, { type: TYPE, rateLimitKey: "comment-delete", needAuth: false, needAccess: false });

export const GET = withApiHandler(async (req) => {
  const { searchParams } = req.nextUrl;
  const postId = searchParams.get("postId");

  if (!postId) {
    const { postIdRequired } = settings.forms[TYPE].backend.responses;
    return responseError(postIdRequired.message, {}, postIdRequired.status);
  }

  const comments = await Comment.find({ postId, isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .populate("userId", "name image email")
    .populate("boardId");

  const { commentsFetched } = settings.forms[TYPE].backend.responses;
  return responseSuccess(commentsFetched.message, { comments }, commentsFetched.status);
}, { type: TYPE, needAuth: false, needAccess: false });
