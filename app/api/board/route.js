import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Board from "@/models/Board";
import { responseMock, responseSuccess, responseError } from "@/libs/utils";
import settings from "@/config/settings.json";

export async function POST(req) {
  if (settings.mocks.Board.isEnabled) {
    return responseMock("Board");
  };

  try {
    const session = await auth();

    if (!session) {
      return responseError("Not authorized");
    }

    const body = await req.json();

    if (!body.name) {
      return responseError("Board name is required", { name: "This field is required" });
    }

    await connectMongo();

    const user = await User.findById(session.user.id);
    const board = await Board.create({ userId: user._id, name: body.name });

    user.boards.push(board._id);
    await user.save();

    return responseSuccess("Board created succesfully", { board })

  } catch (e) {
    return responseError(e.message, {}, 500);
  }
}