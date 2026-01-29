import { loadAppEnv } from "@/modules/general/libs/env";

loadAppEnv();

import { MongoClient, ServerApiVersion } from "mongodb";

let client, clientPromise;

if (
  !process.env.MONGO_URI ||
  !process.env.MONGO_DB ||
  !process.env.MONGO_QUERY
) {
  console.warn(
    'Invalid/Missing environment variable: "MONGO_URI". MongoDB connection will be skipped.',
  );
} else {
  const uri =
    process.env.MONGO_URI + process.env.MONGO_DB + process.env.MONGO_QUERY;
  const options = {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  };

  if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global;

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;
