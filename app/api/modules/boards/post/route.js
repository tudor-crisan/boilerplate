import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import { isResponseMock, responseMock, responseSuccess, responseError } from "@/libs/utils.server";
import { defaultSetting as settings } from "@/libs/defaults";
import User from "@/models/User";
import Post from "@/models/modules/boards/Post";
import Board from "@/models/modules/boards/Board";
import { Filter } from "bad-words";
import { checkReqRateLimit } from "@/libs/rateLimit";

const TYPE = "Post";

const {
  notAuthorized,
  sessionLost,
  serverError,
  noAccess,
} = settings.forms.general.backend.responses;



export async function POST(req) {
  if (isResponseMock(TYPE)) {
    return responseMock(TYPE);
  };

  if (!settings.forms?.[TYPE]) {
    return responseError(serverError.message, {}, serverError.status);
  }

  const {
    titleRequired,
    descriptionRequired,
    boardIdRequired,
    createSuccesfully,
  } = settings.forms[TYPE].backend.responses;

  const error = await checkReqRateLimit(req, "post-create");
  if (error) return error;

  try {
    const { searchParams } = req.nextUrl;
    const boardId = searchParams.get("boardId");

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

    const clientId = req.headers.get("x-client-id");

    if (clientId) {
      postData.lastActionByClientId = clientId;
    }

    const post = await Post.create(postData);

    return responseSuccess(createSuccesfully.message, { post }, createSuccesfully.status)



  } catch (e) {
    console.error("Post creation error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}

export async function DELETE(req) {
  const error = await checkReqRateLimit(req, "post-delete");
  if (error) return error;

  if (!settings.forms?.[TYPE]) {
    return responseError(serverError.message, {}, serverError.status);
  }

  const {
    postIdRequired,
    postNotFound,
    deleteSuccesfully,
  } = settings.forms[TYPE].backend.responses;

  try {
    const session = await auth();

    if (!session) {
      return responseError(notAuthorized.message, {}, notAuthorized.status);
    }

    const { searchParams } = req.nextUrl;
    const postId = searchParams.get("postId");

    if (!postId) {
      return responseError(postIdRequired.message, {}, postIdRequired.status);
    }

    await connectMongo();

    const userId = session?.user?.id

    if (!userId) {
      return responseError(sessionLost.message, {}, sessionLost.status);
    }

    const user = await User.findById(userId);

    if (!user.hasAccess) {
      return responseError(noAccess.message, {}, noAccess.status);
    }

    const post = await Post.findById(postId);

    if (!post) {
      return responseError(postNotFound.message, {}, postNotFound.status);
    }

    const board = await Board.findById(post.boardId);

    if (!board) {
      return responseError(notAuthorized.message, {}, notAuthorized.status);
    }

    // check if the person deleting the post is the owner of the board
    if (board.userId.toString() !== user._id.toString()) {
      return responseError(notAuthorized.message, {}, notAuthorized.status);
    }

    await Post.deleteOne({ _id: postId });

    return responseSuccess(deleteSuccesfully.message, {}, deleteSuccesfully.status);

  } catch (e) {
    console.error("Post deletion error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const boardId = searchParams.get("boardId");

    if (!boardId) {
      if (!settings.forms?.[TYPE]) return responseError(serverError.message, {}, serverError.status);
      const { boardIdRequired } = settings.forms[TYPE].backend.responses;
      return responseError(boardIdRequired.message, {}, boardIdRequired.status);
    }

    await connectMongo();

    const posts = await Post.find({ boardId })
      .sort({ votesCounter: -1, createdAt: -1 });

    return responseSuccess("Posts fetched successfully", { posts }, 200);

  } catch (e) {
    console.error("Get posts error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}
