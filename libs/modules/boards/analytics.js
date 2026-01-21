import connectMongo from "@/libs/mongoose";
import Board from "@/models/modules/boards/Board";
import BoardAnalytics from "@/models/modules/boards/BoardAnalytics";
import Notification from "@/models/modules/boards/Notification";

// Helper to get start of day
const getTodayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export async function trackEvent(boardId, type) {
  try {
    await connectMongo();
    const today = getTodayDate();
    const update = { $inc: {} };

    if (type === "VIEW") update.$inc.views = 1;
    else if (type === "POST") update.$inc.posts = 1;
    else if (type === "VOTE") update.$inc.votes = 1;
    else if (type === "COMMENT") update.$inc.comments = 1;
    else return;

    await BoardAnalytics.updateOne({ boardId, date: today }, update, {
      upsert: true,
    });
  } catch (e) {
    console.error("trackEvent Error:", e.message || e);
  }
}

export async function createNotification(boardId, type, data) {
  try {
    await connectMongo();

    // Find board owner and name
    const board = await Board.findById(boardId).select("userId name").lean();
    if (!board || !board.userId) {
      console.warn(
        `[Notification Warning] Board ${boardId} or owner not found.`,
      );
      return;
    }

    await Notification.create({
      userId: board.userId,
      boardId,
      type,
      data: {
        ...data,
        boardName: board.name,
      },
    });
  } catch (e) {
    console.error("createNotification Error:", e.message || e);
  }
}
