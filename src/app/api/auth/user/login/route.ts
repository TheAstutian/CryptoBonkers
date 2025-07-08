import bcrypt from "bcryptjs";
import { UserDB } from "@/lib/model";
import {z} from 'zod'; 
import { NextResponse } from "next/server";


//data from client 
const getUserSchema = z.object({
    email: z.string().email("Invalid email address"), 
    password: z.string().min(6, "Password must be at least 6 characters long"),
})
//get user from DB 

export async function POST (request: Request) {
    
    let requestBody;
    try {
        requestBody = await request.json(); 
        
    } catch (error){ 
        console.log(error)
    return NextResponse.json({
        status: 400,
        message: "Invalid JSON body provided", 
    }, {status: 400})
    }

    //validate data sent from client 
    const validatedDataFromClient = getUserSchema.safeParse(requestBody)

if (!validatedDataFromClient.success) {
    return NextResponse.json({
        status: 400, 
        message: "Invalid request body", 
        errors: validatedDataFromClient.error.flatten().fieldErrors
    }, {status:400})
}

const { email, password} = validatedDataFromClient.data

 //check if email exists in database 
 const userExists = await UserDB.findOne({email: email})
 
if (!userExists) {
    return NextResponse.json({
        status: 400, 
        message: "User does not exist" 
    }, {status:400})
} 

//compare password hash 
const result = bcrypt.compareSync(password, userExists.password)

if(!result){
    return NextResponse.json({
        status: 400, 
        message: "Wrong username and/or password"
    })
}
else {
    const data = {
        username: userExists.username, 
        email: userExists.email, 
        image: userExists.image,
        link: userExists._id.toString() 
    }
    return NextResponse.json({
        status: 400, 
        message: "Success",
        data
    }, {status: 400})
    
}

}