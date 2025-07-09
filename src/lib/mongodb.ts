import mongoose  from "mongoose";

const mongodbUri = process.env.MONGODB_URI as string 
const mongodbUser = process.env.MONGODB_USER as string 

 

if(!mongodbUri) {
    throw new Error ("MongoDB URI not set")
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

export default async function connectDB(){
 
 try{
    mongoose.connect(mongodbUri, {dbName: mongodbUser})  
    console.log("DATABASE CONNECTION SUCCESSFUL") 
 }catch(err){
    console.log(err)
 }
}

