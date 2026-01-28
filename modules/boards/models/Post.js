import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    votesCounter: {
      type: Number,
      default: 0,
    },
    lastActionByClientId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
