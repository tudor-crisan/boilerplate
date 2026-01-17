import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import connectMongo from "@/libs/mongoose";
import BoardAnalytics from "@/models/modules/boards/BoardAnalytics";
import Board from "@/models/modules/boards/Board";
import User from "@/models/User";
import { sendEmail, WeeklyDigestEmail } from '@/libs/email';
import { getBaseUrl } from "@/libs/utils.server";

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await connectMongo();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Aggregate stats group by boardId for last 7 days
    const stats = await BoardAnalytics.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: "$boardId",
          views: { $sum: "$views" },
          posts: { $sum: "$posts" },
          votes: { $sum: "$votes" },
          comments: { $sum: "$comments" }
        }
      }
    ]);

    if (stats.length === 0) return NextResponse.json({ processed: 0 });

    // Map stats to object for lookup
    const statsMap = {};
    stats.forEach(s => statsMap[s._id.toString()] = s);

    // Find boards that have activity
    const activeBoardIds = stats.map(s => s._id);
    const boards = await Board.find({ _id: { $in: activeBoardIds } }).populate('userId');

    // Group boards by user
    const userBoards = {};
    boards.forEach(board => {
      if (!board.userId || !board.userId.email) return;
      const userId = board.userId._id.toString();
      if (!userBoards[userId]) {
        userBoards[userId] = {
          email: board.userId.email,
          name: board.userId.name,
          styling: board.userId.styling,
          boards: []
        };
      }
      userBoards[userId].boards.push({
        name: board.name,
        stats: statsMap[board._id.toString()]
      });
    });

    // Send emails
    let emailsSent = 0;
    const baseUrl = getBaseUrl();

    for (const userId in userBoards) {
      const data = userBoards[userId];

      try {
        const { subject, html, text } = await WeeklyDigestEmail({
          baseUrl,
          userName: data.name,
          boards: data.boards,
          styling: data.styling
        });

        await sendEmail({
          from: process.env.RESEND_EMAIL_FROM || '',
          email: data.email,
          subject,
          html,
          text
        });
        emailsSent++;
      } catch (e) {
        console.error(`[CRON ERROR] Failed to send email to ${data.email}:`, e.message || e);
      }
    }

    if (emailsSent === 0 && Object.keys(userBoards).length > 0) {
      console.warn("[CRON WARNING] No emails were successfully sent despite having active users/boards. Check email service configuration.");
    }

    return NextResponse.json({ success: true, emailsSent });
  } catch (e) {
    console.error("Cron Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
