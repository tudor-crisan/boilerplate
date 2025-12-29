import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import { isResponseMock, responseMock, responseSuccess, responseError } from "@/libs/utils.server";
import { defaultSetting as settings } from "@/libs/defaults";
import User from "@/models/User";
import Board from "@/models/modules/boards/Board";
import { checkReqRateLimit } from "@/libs/rateLimit";

const TYPE = "Board";

const {
  notAuthorized,
  sessionLost,
  serverError,
  noAccess,
} = settings.forms.general.backend.responses;

const {
  nameRequired,
  boardIdRequired,
  createSuccesfully,
  deleteSuccesfully,
} = settings.forms[TYPE].backend.responses;

export async function POST(req) {
  if (isResponseMock(TYPE)) {
    return responseMock(TYPE);
  };

  const error = await checkReqRateLimit(req, "board-create");
  if (error) return error;

  try {
    const session = await auth();

    if (!session) {
      return responseError(notAuthorized.message, {}, notAuthorized.status);
    }

    const body = await req.json();

    if (!body.name) {
      return responseError(nameRequired.message, nameRequired.inputErrors, nameRequired.status);
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

    const board = await Board.create({ userId: user._id, name: body.name });

    return responseSuccess(createSuccesfully.message, { board }, createSuccesfully.status)

  } catch (e) {
    console.error("Board creation error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}

export async function DELETE(req) {
  const error = await checkReqRateLimit(req, "board-delete");
  if (error) return error;

  try {
    const session = await auth();

    if (!session) {
      return responseError(notAuthorized.message, {}, notAuthorized.status);
    }

    const { searchParams } = req.nextUrl;
    const boardId = searchParams.get("boardId");

    if (!boardId) {
      return responseError(boardIdRequired.message, boardIdRequired.inputErrors, boardIdRequired.status);
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

    await Board.deleteOne({
      _id: boardId,
      userId: userId
    })

    return responseSuccess(deleteSuccesfully.message, {}, deleteSuccesfully.status)

  } catch (e) {
    console.error("Board deletion error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}
