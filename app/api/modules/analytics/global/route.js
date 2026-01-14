import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import BoardAnalytics from "@/models/modules/boards/BoardAnalytics";
import Board from "@/models/modules/boards/Board";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectMongo();

  const { searchParams } = req.nextUrl;
  const range = searchParams.get("range") || "30d";

  // Calculate Date Range
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let startDate = new Date(today);
  let endDate = new Date(now); // End is now (inclusive of today's partial data if any)

  switch (range) {
    case "today":
      startDate = today;
      break;
    case "yesterday":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 1);
      endDate = today; // Up to start of today
      break;
    case "7d":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      break;
    case "30d":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      break;
    case "3m":
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 3);
      break;
    case "thisYear":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case "lastYear":
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear(), 0, 1);
      break;
    default: // 30d
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      break;
  }

  // Find all boards owned by user
  const boards = await Board.find({ userId: session.user.id }).select("_id name");
  const boardIds = boards.map(b => b._id);

  if (boardIds.length === 0) {
    return NextResponse.json({ data: { boards: [], timeline: [] } });
  }

  // Match condition for the range
  const matchCondition = {
    boardId: { $in: boardIds },
    date: { $gte: startDate }
  };
  if (range === "yesterday" || range === "lastYear") {
    matchCondition.date.$lt = endDate;
  }

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
