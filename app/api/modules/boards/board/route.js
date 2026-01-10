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



export async function POST(req) {
  if (isResponseMock(TYPE)) {
    return responseMock(TYPE);
  };

  if (!settings.forms?.[TYPE]) {
    return responseError(serverError.message, {}, serverError.status);
  }

  const {
    nameRequired,
    createSuccesfully,
  } = settings.forms[TYPE].backend.responses;

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

    // Generate unique slug
    let slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    let existingBoard = await Board.findOne({ slug });
    if (existingBoard) {
      slug = `${slug}-${Date.now()}`;
    }

    const board = await Board.create({ userId: user._id, name: body.name, slug });

    return responseSuccess(createSuccesfully.message, { board }, createSuccesfully.status)

  } catch (e) {
    console.error("Board creation error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}

export async function DELETE(req) {
  const error = await checkReqRateLimit(req, "board-delete");
  if (error) return error;

  if (!settings.forms?.[TYPE]) {
    return responseError(serverError.message, {}, serverError.status);
  }

  const {
    boardIdRequired,
    deleteSuccesfully,
  } = settings.forms[TYPE].backend.responses;

  try {
    const session = await auth();

    if (!session) {
      return responseError(notAuthorized.message, {}, notAuthorized.status);
    }

    const { searchParams } = req.nextUrl;
    const boardId = searchParams.get("boardId");

    if (!boardId) {
      if (!settings.forms?.[TYPE]) return responseError(serverError.message, {}, serverError.status); // Fallback if somehow check passed above? Actually redundant but safe.
      const { boardIdRequired } = settings.forms[TYPE].backend.responses;
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

export async function PUT(req) {
  const error = await checkReqRateLimit(req, "board-update");
  if (error) return error;

  if (!settings.forms?.[TYPE]) {
    return responseError(serverError.message, {}, serverError.status);
  }

  const {
    boardIdRequired,
    updateSuccesfully,
    slugAlreadyInUse,
    rateLimitExceeded,
    slugTooShort
  } = settings.forms[TYPE].backend.responses;

  try {
    const session = await auth();

    if (!session) {
      return responseError(notAuthorized.message, {}, notAuthorized.status);
    }

    const body = await req.json();
    const { boardId, slug } = body;

    if (!boardId || !slug) {
      return responseError(boardIdRequired.message, {}, boardIdRequired.status);
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

    const board = await Board.findOne({ _id: boardId, userId: userId });

    if (!board) {
      return responseError("Board not found", {}, 404);
    }

    // Check rate limit (1 day)
    if (board.lastSlugUpdate) {
      const oneDay = 24 * 60 * 60 * 1000;
      if (new Date() - new Date(board.lastSlugUpdate) < oneDay) {
        return responseError(rateLimitExceeded.message, {}, rateLimitExceeded.status);
      }
    }

    // Validate slug format
    const newSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    if (newSlug.length < 3) {
      return responseError(slugTooShort.message, {}, slugTooShort.status);
    }

    // Check uniqueness
    const existing = await Board.findOne({ slug: newSlug });
    if (existing && existing._id.toString() !== boardId) {
      return responseError(slugAlreadyInUse.message, {}, slugAlreadyInUse.status);
    }

    // Update
    if (board.slug && board.slug !== newSlug) {
      board.previousSlugs.push(board.slug);
    }
    board.slug = newSlug;
    board.lastSlugUpdate = new Date();
    await board.save();

    return responseSuccess(updateSuccesfully.message, { slug: newSlug }, updateSuccesfully.status)

  } catch (e) {
    console.error("Board update error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}
