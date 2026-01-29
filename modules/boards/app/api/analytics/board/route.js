import Board from "@/modules/boards/models/Board";
import BoardAnalytics from "@/modules/boards/models/BoardAnalytics";
import { withApiHandler } from "@/modules/general/libs/apiHandler";
import { getAnalyticsDateRange } from "@/modules/general/libs/utils.server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const TYPE = "BoardAnalytics";

async function handler(req, { session }) {
  const { searchParams } = req.nextUrl;
  const boardId = searchParams.get("boardId");

  if (!boardId)
    return NextResponse.json({ error: "Board ID required" }, { status: 400 });
  const range = searchParams.get("range") || "30d";

  // Verify ownership
  const board = await Board.findOne({ _id: boardId, userId: session.user.id });
  if (!board)
    return NextResponse.json({ error: "Access denied" }, { status: 403 });

  // Date Filtering
  const { startDate, endDate } = getAnalyticsDateRange(range);

  // Get stats
  const stats = await BoardAnalytics.find({
    boardId: new mongoose.Types.ObjectId(boardId),
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });

  return NextResponse.json({ stats });
}

export const GET = withApiHandler(handler, {
  type: TYPE,
  needAccess: false,
});
