import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import Notification from "@/models/modules/boards/Notification";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectMongo();
  const notifications = await Notification.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("boardId", "name slug");

  return NextResponse.json({ data: { notifications } });
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
