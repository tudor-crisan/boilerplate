import mongoose from "mongoose";

const boardAnalyticsSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    views: { type: Number, default: 0 },
    posts: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

// Compound index for fast lookup by board and date
boardAnalyticsSchema.index({ boardId: 1, date: 1 }, { unique: true });

const BoardAnalytics =
  mongoose.models.BoardAnalytics ||
  mongoose.model("BoardAnalytics", boardAnalyticsSchema);

export default BoardAnalytics;
