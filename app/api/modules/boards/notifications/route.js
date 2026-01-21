import { withApiHandler } from "@/libs/apiHandler";
import Notification from "@/models/modules/boards/Notification";
import { NextResponse } from "next/server";

const TYPE = "Notification";

async function getHandler(req, { session }) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20")),
  );
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("boardId", "name slug")
    .lean();

  const totalCount = await Notification.countDocuments({
    userId: session.user.id,
  });
  const hasMore = skip + notifications.length < totalCount;

  return NextResponse.json({
    data: {
      notifications,
      hasMore,
      totalCount,
      page,
      limit,
    },
  });
}

async function putHandler(req, { session }) {
  const { notificationIds } = await req.json();

  if (!Array.isArray(notificationIds)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await Notification.updateMany(
    { _id: { $in: notificationIds }, userId: session.user.id },
    { $set: { isRead: true } },
  );

  return NextResponse.json({ data: { success: true } });
}

export const GET = withApiHandler(getHandler, {
  type: TYPE,
  needAccess: false,
});
export const PUT = withApiHandler(putHandler, {
  type: TYPE,
  needAccess: false,
});
