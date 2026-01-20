import mongoose from "mongoose";
import { loadAppEnv } from "./env";

loadAppEnv();

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongo() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI || !process.env.MONGO_DB || !process.env.MONGO_QUERY) {
    console.warn('Invalid/Missing environment variable: "MONGO_URI". MongoDB connection will be skipped.');
    return;
  }

  if (!cached.promise) {
    const uri = process.env.MONGO_URI + process.env.MONGO_DB + process.env.MONGO_QUERY;
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(`❌ Mongoose error: ${e.message}`);
    throw e;
  }

  return cached.conn;
}

export default connectMongo;