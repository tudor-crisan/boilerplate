
import connectMongo from "@/libs/mongoose";
import { isResponseMock, responseMock, responseSuccess, responseError } from "@/libs/utils.server";
import { defaultSetting as settings } from "@/libs/defaults";
import Post from "@/models/modules/boards/Post";
import { checkReqRateLimit } from "@/libs/rateLimit";

const TYPE = "Vote";

const {
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
    voteRecorded,
    postNotFound,
    postIdRequired,
  } = settings.forms[TYPE].backend.responses;

  const error = await checkReqRateLimit(req, "vote-toggle");
  if (error) return error;

  try {
    const { searchParams } = req.nextUrl;
    const postId = searchParams.get("postId");

    if (!postId) {
      return responseError(postIdRequired.message, {}, postIdRequired.status);
    }

    await connectMongo();

    const post = await Post.findById(postId);

    if (!post) {
      return responseError(postNotFound.message, {}, postNotFound.status);
    }

    const clientId = req.headers.get("x-client-id");

    post.votesCounter += 1;
    post.lastActionByClientId = clientId;
    await post.save();

    // Emitting via Change Stream now (handled in stream/route.js)

    return responseSuccess(voteRecorded.message, {}, voteRecorded.status)

  } catch (e) {
    console.error("Vote error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}

export async function DELETE(req) {
  if (isResponseMock(TYPE)) {
    return responseMock(TYPE);
  };

  if (!settings.forms?.[TYPE]) {
    return responseError(serverError.message, {}, serverError.status);
  }

  const {
    voteRemoved,
    postNotFound,
    postIdRequired,
  } = settings.forms[TYPE].backend.responses;

  const error = await checkReqRateLimit(req, "vote-toggle");
  if (error) return error;

  try {
    const { searchParams } = req.nextUrl;
    const postId = searchParams.get("postId");

    if (!postId) {
      return responseError(postIdRequired.message, {}, postIdRequired.status);
    }

    await connectMongo();

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
