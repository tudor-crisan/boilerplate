import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import BoardAnalytics from "@/models/modules/boards/BoardAnalytics";
import Board from "@/models/modules/boards/Board";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectMongo();

  // Find all boards owned by user
  const boards = await Board.find({ userId: session.user.id }).select("_id name");
  const boardIds = boards.map(b => b._id);

  if (boardIds.length === 0) {
    return NextResponse.json({ boards: [], timeline: [] });
  }

  // Aggregate stats per board
  const analytics = await BoardAnalytics.aggregate([
    { $match: { boardId: { $in: boardIds } } },
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

  // Group by date for global timeline (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const timeline = await BoardAnalytics.aggregate([
    {
      $match: {
        boardId: { $in: boardIds },
        date: { $gte: thirtyDaysAgo }
      }
    },
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

  return NextResponse.json({ boards: boardsData, timeline });
}
