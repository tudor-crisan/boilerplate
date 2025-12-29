import mongoose from "mongoose";

if (!process.env.MONGO_URI || !process.env.MONGO_DB || !process.env.MONGO_QUERY) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

const connectMongo = async () => {
  try {
    const uri = process.env.MONGO_URI + process.env.MONGO_DB + process.env.MONGO_QUERY;
    await mongoose.connect(uri);
  } catch (e) {
    console.error(`❌ Mongoose error: ${e.message}`);
  }
}

export default connectMongo;