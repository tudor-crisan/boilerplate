if (typeof window === "undefined") {
  const dotenv = await import("dotenv");
  const fs = await import("fs");
  const path = await import("path");

  const appName = process.env.APP || process.env.NEXT_PUBLIC_APP;
  if (appName) {
    const envPath = path.join(process.cwd(), 'env', 'env-dev', `.env.dev.${appName}`);
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath, quiet: true });
    }
  }
}

import mongoose from "mongoose";

const connectMongo = async () => {
  if (!process.env.MONGO_URI || !process.env.MONGO_DB || !process.env.MONGO_QUERY) {
    console.warn('Invalid/Missing environment variable: "MONGO_URI". MongoDB connection will be skipped.');
    return;
  }
  try {
    const uri = process.env.MONGO_URI + process.env.MONGO_DB + process.env.MONGO_QUERY;
    await mongoose.connect(uri);
  } catch (e) {
    console.error(`❌ Mongoose error: ${e.message}`);
  }
}

export default connectMongo;