
import connectMongo from "@/libs/mongoose";
import { isResponseMock, responseMock, responseSuccess, responseError } from "@/libs/utils.server";
import { defaultSetting as settings } from "@/libs/defaults";
import Post from "@/models/modules/boards/Post";
import { checkReqRateLimit } from "@/libs/rateLimit";

const TYPE = "Vote";

const {
  voteRecorded,
  voteRemoved,
  postNotFound,
  postIdRequired,
} = settings.forms[TYPE].backend.responses;

const {
  serverError,
} = settings.forms.general.backend.responses;

export async function POST(req) {
  if (isResponseMock(TYPE)) {
    return responseMock(TYPE);
  };

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

    post.votesCounter += 1;
    await post.save();

    return responseSuccess(voteRecorded.message, {}, voteRecorded.status)

  } catch (e) {
    console.error("Vote error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}

export async function DELETE(req) {
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

    post.votesCounter -= 1;
    await post.save();

    return responseSuccess(voteRemoved.message, {}, voteRemoved.status);
  } catch (e) {
    console.error("Vote remove error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}
