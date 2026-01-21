import mongoose from "mongoose";

const rateLimitSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    route: { type: String, required: true },
    requests: { type: Number, default: 1 },
    firstRequest: { type: Date, default: Date.now },
    lastRequest: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

// Compound index for unique rate limit bucket per IP per route
// using background: true is good practice even if not strictly necessary for dev
rateLimitSchema.index({ ip: 1, route: 1 }, { unique: true });

// Expire documents after 24 hours to keep DB clean
rateLimitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const RateLimit =
  mongoose.models.RateLimit || mongoose.model("RateLimit", rateLimitSchema);

export default RateLimit;
