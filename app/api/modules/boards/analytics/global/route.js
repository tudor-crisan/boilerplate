import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import mongoose from "mongoose";
import BoardAnalytics from "@/models/modules/boards/BoardAnalytics";
import Board from "@/models/modules/boards/Board";
import { NextResponse } from "next/server";
import { getAnalyticsDateRange } from "@/libs/utils.server";

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectMongo();

  const { searchParams } = req.nextUrl;
  const range = searchParams.get("range") || "30d";

  // Calculate Date Range
  const { startDate, endDate } = getAnalyticsDateRange(range);

  // Find all boards owned by user
  const boards = await Board.find({ userId: session.user.id }).select("_id name");
  const boardIds = boards.map(b => new mongoose.Types.ObjectId(b._id));

  if (boardIds.length === 0) {
    return NextResponse.json({ data: { boards: [], timeline: [] } });
  }

  // Match condition for the range
  const matchCondition = {
    boardId: { $in: boardIds },
    date: { $gte: startDate, $lte: endDate }
  };

  // Aggregate stats per board (Filtered by range)
  const analytics = await BoardAnalytics.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: "$boardId",
        totalViews: { $sum: "$views" },
        totalPosts: { $sum: "$posts" },
        totalVotes: { $sum: "$votes" },
        totalComments: { $sum: "$comments" }
      }
    }
  ]);

  // Combine with board names
  const boardsData = boards.map(board => {
    const stats = analytics.find(a => a._id.toString() === board._id.toString()) || {
      totalViews: 0, totalPosts: 0, totalVotes: 0, totalComments: 0
    };
    return {
      _id: board._id,
      name: board.name,
      ...stats
    };
  });

  // Timeline for the chart
  const timeline = await BoardAnalytics.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: "$date",
        views: { $sum: "$views" },
        posts: { $sum: "$posts" },
        votes: { $sum: "$votes" },
        comments: { $sum: "$comments" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return NextResponse.json({ data: { boards: boardsData, timeline } });
}
