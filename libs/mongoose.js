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