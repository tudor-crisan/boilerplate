import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import { isResponseMock, responseMock, responseSuccess, responseError } from "@/libs/utils.server";
import { defaultSetting as settings } from "@/libs/defaults";
import User from "@/models/User";
import Board from "@/models/Board";

const TYPE = "Board";

export async function POST(req) {
  if (isResponseMock(TYPE)) {
    return responseMock(TYPE);
  };

  const {
    notAuthorized,
    nameRequired,
    createSuccesfully
  } = settings.forms[TYPE].backend.responses;

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

    const user = await User.findById(session.user.id);
    const board = await Board.create({ userId: user._id, name: body.name });

    user.boards.push(board._id);
    await user.save();

    return responseSuccess(createSuccesfully.message, { board }, createSuccesfully.status)

  } catch (e) {
    return responseError(e.message, {}, 500);
  }
}
