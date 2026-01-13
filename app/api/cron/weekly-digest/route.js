import { NextResponse } from 'next/server';
import connectMongo from "@/libs/mongoose";
import BoardAnalytics from "@/models/modules/boards/BoardAnalytics";
import Board from "@/models/modules/boards/Board";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    for (const userId in userBoards) {
      const data = userBoards[userId];
      const emailContent = `
        <h1>Weekly Board Digest</h1>
        <p>Hi ${data.name || 'there'}, here is your weekly summary for your boards:</p>
        <ul>
          ${data.boards.map(b => `
            <li style="margin-bottom: 20px;">
              <strong>${b.name}</strong><br/>
              👀 Views: ${b.stats.views}<br/>
              📝 Posts: ${b.stats.posts}<br/>
              👍 Votes: ${b.stats.votes}<br/>
              💬 Comments: ${b.stats.comments}
            </li>
          `).join('')}
        </ul>
        <p>Keep up the great work!</p>
      `;

      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: data.email,
          subject: 'Your Weekly Board Stats 📈',
          html: emailContent
        });
        emailsSent++;
      } catch (e) {
        console.error(`Failed to send email to ${data.email}`, e);
      }
    }

    return NextResponse.json({ success: true, emailsSent });
  } catch (e) {
    console.error("Cron Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
