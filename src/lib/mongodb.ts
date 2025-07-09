/*import mongoose  from "mongoose";

const mongodbUri = process.env.MONGODB_URI as string 
const mongodbUser = process.env.MONGODB_USER as string 

 

if(!mongodbUri) {
    throw new Error ("MongoDB URI not set")
}


export default async function connectDB(){
 
    try{
      await mongoose.connect(mongodbUri, {
        dbName: mongodbUser,
        serverSelectionTimeoutMS: 30000, 
        socketTimeoutMS: 45000,
    })  
       console.log("DATABASE CONNECTION SUCCESSFUL") 
    }catch(err){
       console.log(err)
    }
   }
   
   
/*if(!mongodbUser) {
    throw new Error ("MongoDB User not set")
}*/

/*
//cache connection
let cached = global as typeof global & {
    mongoose: {conn: Mongoose | null; promise: Promise<Mongoose> | null}
} 

if (!cached.mongoose) {
    cached.mongoose = {conn: null, promise: null}
}

async function connectDB(): Promise<Mongoose>{
    if(cached.mongoose.conn){
        return cached.mongoose.conn 
    }

    if(!cached.mongoose.promise){
        const opts = {
            bufferCommands: false, 
        }
        cached.mongoose.promise = mongoose.connect(mongodbUri!, opts).then(mongoose=>mongoose)
        
    }

    try{
        cached.mongoose.conn = await cached.mongoose.promise;
    }catch(err){
        cached.mongoose.promise = null; 
        throw err
    }

    return cached.mongoose.conn 
} 

export default connectDB;  
*/

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
const MONGODB_DBNAME = process.env.MONGODB_USER as string;

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
