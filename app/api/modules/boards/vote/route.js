import { withApiHandler } from "@/libs/apiHandler";
import { defaultSetting as settings } from "@/libs/defaults";
import {
  createNotification,
  trackEvent,
} from "@/libs/modules/boards/analytics";
import { responseError, responseSuccess } from "@/libs/utils.server";
import Post from "@/models/modules/boards/Post";

const TYPE = "Vote";

async function postHandler(req) {
  const { serverError } = settings.forms.general.backend.responses;

  const { voteRecorded, postNotFound, postIdRequired } =
    settings.forms[TYPE].backend.responses;

  try {
    const { searchParams } = req.nextUrl;
    const postId = searchParams.get("postId");

    if (!postId) {
      return responseError(postIdRequired.message, {}, postIdRequired.status);
    }

    const post = await Post.findById(postId);

    if (!post) {
      return responseError(postNotFound.message, {}, postNotFound.status);
    }

    const clientId = req.headers.get("x-client-id");

    post.votesCounter += 1;
    post.lastActionByClientId = clientId;
    await post.save();

    // Analytics & Notifications
    await trackEvent(post.boardId, "VOTE");
    await createNotification(post.boardId, "VOTE", {
      postId: post._id,
      postTitle: post.title,
    });

    return responseSuccess(voteRecorded.message, {}, voteRecorded.status);
  } catch (e) {
    console.error("Vote error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}

async function deleteHandler(req) {
  const { serverError } = settings.forms.general.backend.responses;

  const { voteRemoved, postNotFound, postIdRequired } =
    settings.forms[TYPE].backend.responses;

  try {
    const { searchParams } = req.nextUrl;
    const postId = searchParams.get("postId");

    if (!postId) {
      return responseError(postIdRequired.message, {}, postIdRequired.status);
    }

    const post = await Post.findById(postId);

    if (!post) {
      return responseError(postNotFound.message, {}, postNotFound.status);
    }

    const clientId = req.headers.get("x-client-id");

    post.votesCounter -= 1;
    post.lastActionByClientId = clientId;
    await post.save();

    return responseSuccess(voteRemoved.message, {}, voteRemoved.status);
  } catch (e) {
    console.error("Vote remove error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}

export const POST = withApiHandler(postHandler, {
  type: TYPE,
  rateLimitKey: "vote-toggle",
  needAuth: false,
  needAccess: false,
});

export const DELETE = withApiHandler(deleteHandler, {
  type: TYPE,
  rateLimitKey: "vote-toggle",
  needAuth: false,
  needAccess: false,
});
