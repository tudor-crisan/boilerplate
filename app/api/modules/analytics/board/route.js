import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import BoardAnalytics from "@/models/modules/boards/BoardAnalytics";
import Board from "@/models/modules/boards/Board";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const boardId = searchParams.get("boardId");

  if (!boardId) return NextResponse.json({ error: "Board ID required" }, { status: 400 });

  await connectMongo();

  // Verify ownership
  const board = await Board.findOne({ _id: boardId, userId: session.user.id });
  if (!board) return NextResponse.json({ error: "Access denied" }, { status: 403 });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  // Get stats
  const stats = await BoardAnalytics.find({
    boardId,
    date: { $gte: thirtyDaysAgo }
  }).sort({ date: 1 });

  return NextResponse.json({ stats });
}
