import { auth } from "@/libs/auth";
import connectMongo from "@/libs/modules/boards/mongoose";
import { isResponseMock, responseMock, responseSuccess, responseError } from "@/libs/utils.server";
import { defaultSetting as settings } from "@/libs/defaults";
import User from "@/models/modules/boards/User";
import Board from "@/models/modules/boards/Board";

const TYPE = "Board";

const {
  notAuthorized,
  sessionLost,
  serverError,
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
    const board = await Board.create({ userId: user._id, name: body.name });

    user.boards.push(board._id);
    await user.save();

    return responseSuccess(createSuccesfully.message, { board }, createSuccesfully.status)

  } catch (e) {
    return responseError(serverError.message, {}, serverError.status);
  }
}

export async function DELETE(req) {
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

    await Board.deleteOne({
      _id: boardId,
      userId: userId
    })

    const user = await User.findById(session.user.id);
    user.boards = user.boards.filter((id) => id.toString() !== boardId);

    await user.save();

    return responseSuccess(deleteSuccesfully.message, {}, deleteSuccesfully.status)

  } catch (e) {
    return responseError(serverError.message, {}, serverError.status);
  }
}
