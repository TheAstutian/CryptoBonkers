import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME as string;

if (!MONGODB_URI) {
  throw new Error("MongoDB URI not set");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Ensure global.mongoose is always defined
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const cached = global.mongoose!; // Non-null assertion since we just set it above

export default async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DBNAME,
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000, 
    }).then((mongoose) => mongoose);
  }
  try {
    cached.conn = await cached.promise;
    console.log("DATABASE CONNECTION SUCCESSFUL");
    return cached.conn;
  } catch (err) {
    console.error("DATABASE CONNECTION ERROR:", err);
    throw err;
  }
}
