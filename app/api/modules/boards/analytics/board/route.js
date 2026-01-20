import { withApiHandler } from "@/libs/apiHandler";
import { getAnalyticsDateRange } from "@/libs/utils.server";
import Board from "@/models/modules/boards/Board";
import BoardAnalytics from "@/models/modules/boards/BoardAnalytics";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const TYPE = "BoardAnalytics";

async function handler(req, { session }) {
  const { searchParams } = req.nextUrl;
  const boardId = searchParams.get("boardId");

  if (!boardId) return NextResponse.json({ error: "Board ID required" }, { status: 400 });
  const range = searchParams.get("range") || "30d";

  // Verify ownership
  const board = await Board.findOne({ _id: boardId, userId: session.user.id });
  if (!board) return NextResponse.json({ error: "Access denied" }, { status: 403 });

  // Date Filtering
  const { startDate, endDate } = getAnalyticsDateRange(range);

  // Get stats
  const stats = await BoardAnalytics.find({
    boardId: new mongoose.Types.ObjectId(boardId),
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });

  return NextResponse.json({ stats });
}

export const GET = withApiHandler(handler, {
  type: TYPE
});
