import { responseSuccess, responseError, generateSlug } from "@/libs/utils.server";
import { defaultSetting as settings } from "@/libs/defaults";
import Board from "@/models/modules/boards/Board";
import Post from "@/models/modules/boards/Post";
import { revalidatePath } from "next/cache";
import { withApiHandler } from "@/libs/apiHandler";

const TYPE = "Board";

export const POST = withApiHandler(async (req, { user }) => {
  if (!settings.forms?.[TYPE]) {
    throw new Error("Missing settings for " + TYPE);
  }

  const {
    nameRequired,
    nameTooShort,
    createSuccesfully,
  } = settings.forms[TYPE].backend.responses;

  const body = await req.json();

  if (!body.name) {
    return responseError(nameRequired.message, nameRequired.inputErrors, nameRequired.status);
  }

  if (body.name.length < 3) {
    return responseError(nameTooShort.message, {}, nameTooShort.status);
  }

  // Generate unique slug
  let slug = generateSlug(body.name);
  let existingBoard = await Board.findOne({ slug });
  if (existingBoard) {
    slug = `${slug}-${Date.now()}`;
  }

  const board = await Board.create({ userId: user._id, name: body.name, slug });

  return responseSuccess(createSuccesfully.message, { board }, createSuccesfully.status);
}, { type: TYPE, rateLimitKey: "board-create" });

export const DELETE = withApiHandler(async (req, { user }) => {
  const {
    boardIdRequired,
    deleteSuccesfully,
  } = settings.forms[TYPE].backend.responses;

  const { searchParams } = req.nextUrl;
  const boardId = searchParams.get("boardId");

  if (!boardId) {
    return responseError(boardIdRequired.message, boardIdRequired.inputErrors, boardIdRequired.status);
  }

  await Board.deleteOne({
    _id: boardId,
    userId: user._id
  });

  await Post.deleteMany({ boardId: boardId });

  return responseSuccess(deleteSuccesfully.message, {}, deleteSuccesfully.status);
}, { type: TYPE, rateLimitKey: "board-delete" });

export const PUT = withApiHandler(async (req, { user }) => {
  const {
    boardIdRequired,
    updateSuccesfully,
    slugAlreadyInUse,
    rateLimitExceeded,
    slugTooShort
  } = settings.forms[TYPE].backend.responses;

  const body = await req.json();
  const { boardId, slug, name } = body;

  if (!boardId || !slug) {
    return responseError(boardIdRequired.message, {}, boardIdRequired.status);
  }

  const board = await Board.findOne({ _id: boardId, userId: user._id });

  if (!board) {
    return responseError("Board not found", {}, 404);
  }

  // Validate slug format
  const newSlug = generateSlug(slug);

  // Check rate limit (1 day)
  if (board.slug !== newSlug && board.lastSlugUpdate) {
    const oneDay = 24 * 60 * 60 * 1000;
    if (new Date() - new Date(board.lastSlugUpdate) < oneDay) {
      return responseError(rateLimitExceeded.message, {}, rateLimitExceeded.status);
    }
  }

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
    board.lastSlugUpdate = new Date();
  }

  board.slug = newSlug;

  if (name && board.name !== name) {
    board.name = name;
  }

  if (body.extraSettings) {
    try {
      const extraSettings = typeof body.extraSettings === 'string'
        ? JSON.parse(body.extraSettings)
        : body.extraSettings;

      board.extraSettings = extraSettings;
      board.markModified("extraSettings");
    } catch (e) {
      console.error("Invalid JSON for extraSettings", e);
    }
  }

  await board.save();

  revalidatePath(`/b/${newSlug}`);
  revalidatePath(`/dashboard/b/${boardId}`);

  return responseSuccess(updateSuccesfully.message, { slug: newSlug }, updateSuccesfully.status);
}, { type: TYPE, rateLimitKey: "board-update" });
