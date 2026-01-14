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
  const range = searchParams.get("range") || "30d";

  await connectMongo();

  // Verify ownership
  const board = await Board.findOne({ _id: boardId, userId: session.user.id });
  if (!board) return NextResponse.json({ error: "Access denied" }, { status: 403 });

  // Date Filtering
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();

  switch (range) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      startDate.setDate(now.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(now.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case '7d':
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      break;
    case '3m':
      startDate.setMonth(now.getMonth() - 3);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'thisYear':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'lastYear':
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
      break;
    default:
      startDate.setDate(now.getDate() - 30);
  }

  // Get stats
  const stats = await BoardAnalytics.find({
    boardId,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });

  return NextResponse.json({ stats });
}
