import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import Notification from "@/models/modules/boards/Notification";
import Board from "@/models/modules/boards/Board";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  await connectMongo();
  const notifications = await Notification.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("boardId", "name slug")
    .lean();

  const totalCount = await Notification.countDocuments({ userId: session.user.id });
  const hasMore = skip + notifications.length < totalCount;

  return NextResponse.json({ data: { notifications, hasMore, totalCount } });
}

export async function PUT(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { notificationIds } = await req.json();

  await connectMongo();
  await Notification.updateMany(
    { _id: { $in: notificationIds }, userId: session.user.id },
    { $set: { isRead: true } }
  );

  return NextResponse.json({ data: { success: true } });
}
