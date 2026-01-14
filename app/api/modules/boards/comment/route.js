import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import { isResponseMock, responseMock, responseSuccess, responseError } from "@/libs/utils.server";
import { defaultSetting as settings } from "@/libs/defaults";
import Board from "@/models/modules/boards/Board";
import Comment from "@/models/modules/boards/Comment";
import Post from "@/models/modules/boards/Post";
import { Filter } from "bad-words";
import { checkReqRateLimit } from "@/libs/rateLimit";
import { trackEvent, createNotification } from "@/libs/modules/boards/analytics";

const TYPE = "Comment";

const {
  notAuthorized,
  serverError,
} = settings.forms.general.backend.responses;

export async function POST(req) {
  if (isResponseMock(TYPE)) {
    return responseMock(TYPE);
  };

  if (!settings.forms?.[TYPE]) {
    return responseError(serverError.message, {}, serverError.status);
  }

  const {
    textRequired,
    nameRequired,
    postIdRequired,
    createSuccesfully,
    commentNotFound,
  } = settings.forms[TYPE].backend.responses;

  const error = await checkReqRateLimit(req, "comment-create");
  if (error) return error;

  try {
    const body = await req.json();

    if (!body.postId) {
      return responseError(postIdRequired.message, {}, postIdRequired.status);
    }

    if (!body.text) {
      return responseError(textRequired.message, textRequired.inputErrors, textRequired.status);
    }

    await connectMongo();

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

    // Populate user if exists to return consistent structure
    // Populate user if exists to return consistent structure
    if (userId) {
      await comment.populate("userId", "name image email");
    }
    await comment.populate("boardId");

    return responseSuccess(createSuccesfully.message, { comment }, createSuccesfully.status);

  } catch (e) {
    console.error("Comment creation error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}

export async function DELETE(req) {
  const error = await checkReqRateLimit(req, "comment-delete");
  if (error) return error;

  if (!settings.forms?.[TYPE]) {
    return responseError(serverError.message, {}, serverError.status);
  }

  const {
    deleteSuccesfully,
    commentNotFound
  } = settings.forms[TYPE].backend.responses;

  try {
    const session = await auth();

    // Removed global session check to allow guest deletion


    const { searchParams } = req.nextUrl;
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return responseError(commentNotFound.message, {}, commentNotFound.status);
    }

    await connectMongo();

    const userId = session?.user?.id;

    // Remove sessionLost check as we allow guests


    const comment = await Comment.findById(commentId);

    if (!comment) {
      return responseError(commentNotFound.message, {}, commentNotFound.status);
    }

    // Check permissions: Owner of comment OR Owner of board
    let canDelete = false;

    if (userId && comment.userId && comment.userId.toString() === userId) {
      // Logged in user deletes their own comment
      canDelete = true;
    } else if (userId) {
      // Logged in user checks if they own the board
      const board = await Board.findById(comment.boardId);
      if (board && board.userId.toString() === userId) {
        canDelete = true;
      }
    } else if (!comment.userId) {
      // Anonymous comment - allow deletion (relying on client to have the ID)
      canDelete = true;
    }

    if (!canDelete) {
      return responseError(notAuthorized.message, {}, notAuthorized.status);
    }

    await Comment.updateOne({ _id: commentId }, { $set: { isDeleted: true } });

    return responseSuccess(deleteSuccesfully.message, {}, deleteSuccesfully.status);

  } catch (e) {
    console.error("Comment deletion error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const postId = searchParams.get("postId");

    if (!postId) {
      const { postIdRequired } = settings.forms[TYPE].backend.responses;
      return responseError(postIdRequired.message, {}, postIdRequired.status);
    }

    await connectMongo();

    const comments = await Comment.find({ postId, isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .populate("userId", "name image email")
      .populate("boardId");

    const { commentsFetched } = settings.forms[TYPE].backend.responses;
    return responseSuccess(commentsFetched.message, { comments }, commentsFetched.status);

  } catch (e) {
    console.error("Get comments error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}
