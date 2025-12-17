import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Board from "@/models/Board";
// import { mockSuccessBoard, mockErrorBoard } from "@/libs/mocks";

export async function POST(req) {
  // return mockSuccessBoard();

  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      )
    }

    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Board name is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    const user = await User.findById(session.user.id);

    const board = await Board.create({
      userId: user._id,
      name: body.name
    });

    user.boards.push(board._id);
    await user.save();

    return NextResponse.json(
      { message: "Board created succesfully", data: { board } },
      { status: 200 }
    );

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}