import connectMongo from "@/libs/mongoose";
import mongoose from "mongoose";
import BoardAnalytics from "@/models/modules/boards/BoardAnalytics";
import Notification from "@/models/modules/boards/Notification";
import Board from "@/models/modules/boards/Board";

// Helper to get start of day
const getTodayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Track an event for board analytics
 * @param {string} boardId 
 * @param {'VIEW' | 'POST' | 'VOTE' | 'COMMENT'} type 
 */
export async function trackEvent(boardId, type) {
  try {
    await connectMongo();
    const today = getTodayDate();
    const update = { $inc: {} };
    const boardObjectId = new mongoose.Types.ObjectId(boardId);

    if (type === 'VIEW') update.$inc.views = 1;
    else if (type === 'POST') update.$inc.posts = 1;
    else if (type === 'VOTE') update.$inc.votes = 1;
    else if (type === 'COMMENT') update.$inc.comments = 1;
    else return;

    await BoardAnalytics.updateOne(
      { boardId: boardObjectId, date: today },
      update,
      { upsert: true }
    );
  } catch (e) {
    console.error("Analytics Error:", e);
  }
}

/**
 * Create a notification for the board owner
 * @param {string} boardId 
 * @param {'POST' | 'VOTE' | 'COMMENT'} type 
 * @param {object} data 
 */
export async function createNotification(boardId, type, data) {
  try {
    await connectMongo();

    // Find board owner
    const board = await Board.findById(boardId).select("userId");
    if (!board || !board.userId) return;

    await Notification.create({
      userId: board.userId,
      boardId,
      type,
      data
    });
  } catch (e) {
    console.error("Notification Error:", e);
  }
}
