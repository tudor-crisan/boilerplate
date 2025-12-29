import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import { isResponseMock, responseMock, responseSuccess, responseError } from "@/libs/utils.server";
import { defaultSetting as settings } from "@/libs/defaults";

import Post from "@/models/modules/boards/Post";
import { Filter } from "bad-words";
import { checkRateLimit } from "@/libs/rateLimit";

const TYPE = "Post";

const {
  serverError,
} = settings.forms.general.backend.responses;

const {
  titleRequired,
  descriptionRequired,
  boardIdRequired,
  createSuccesfully,
} = settings.forms[TYPE].backend.responses;

export async function POST(req) {
  if (isResponseMock(TYPE)) {
    return responseMock(TYPE);
  };

  const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";
  const { allowed, message } = await checkRateLimit(ip, "post-create", 10, 60);

  if (!allowed) {
    return responseError(message, {}, 429);
  }

  try {
    const { searchParams } = req.nextUrl;
    const boardId = searchParams.get("boardId");

    if (!boardId) {
      return responseError(boardIdRequired.message, {}, boardIdRequired.status);
    }

    const body = await req.json();

    if (!body.title) {
      return responseError(titleRequired.message, {}, titleRequired.status);
    }

    if (!body.description) {
      return responseError(descriptionRequired.message, {}, descriptionRequired.status);
    }

    const filter = new Filter();
    const cleanTitle = filter.clean(body.title);
    const cleanDescription = filter.clean(body.description);

    await connectMongo();

    const session = await auth();
    const userId = session?.user?.id;

    const postData = {
      title: cleanTitle,
      description: cleanDescription,
      boardId: boardId,
    };

    if (userId) {
      postData.userId = userId;
    }

    const post = await Post.create(postData);

    return responseSuccess(createSuccesfully.message, { post }, createSuccesfully.status)

  } catch (e) {
    console.error("Post creation error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}
