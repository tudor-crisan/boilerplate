import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    maxlength: 30
  },
  previousSlugs: [{
    type: String
  }],
  lastSlugUpdate: {
    type: Date
  },
  extraSettings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

const Board = (mongoose.models.Board || mongoose.model("Board", boardSchema));

export default Board;
