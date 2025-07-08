import bcrypt from "bcryptjs";
import { UserDB } from "@/lib/model";
import {z} from 'zod'; 
import { NextResponse } from "next/server";
 

//schema for expected request body to validate it
const createUserSchema = z.object({
    username: z.string().min(1,"Username is required"), 
    email: z.string().email("Invalid email address"), 
    password: z.string().min(6, "Password must be at least 6 characters long"),
    image: z.string().url().optional()
})

export async function POST(request:Request){

let requestBody; 
try {
    requestBody = await request.json(); 
} catch (error){ 
return NextResponse.json({
    status: 400,
    message: "Invalid JSON body provided", 
}, {status: 400})
}

    //validate request body using zod schema
const validatedDataFromClient = createUserSchema.safeParse(requestBody)

if (!validatedDataFromClient.success) {
    return NextResponse.json({
        status: 400, 
        message: "Invalid request body", 
        errors: validatedDataFromClient.error.flatten().fieldErrors
    }, {status:400})
}

const {username, email, password, image} = validatedDataFromClient.data

//check if email exists

const userExists = await UserDB.findOne({email: email})
if (userExists) {
    return NextResponse.json({
        status: 400, 
        message: "Email already exists"
    }, {status:400})
}

//hash password
 const salt = bcrypt.genSaltSync(10)
 const hash = bcrypt.hashSync(password,salt)

 const newUser = {
    username, 
    email, 
    image, 
    password: hash,
    createdAt: Date.now(),
    permissions: 'Administrator'
 }

 try{
    UserDB.insertOne(newUser).then(
        result => {
            if (!result){
                return NextResponse.json({
                    status: 400, 
                    message: 'An error occured while added new user'
                })
            }
            else return NextResponse.json({
                status: 200, 
                message: 'New User Created'
            })
        }
     )
 }catch(err){
    return NextResponse.json({
        status: 400, 
        message: 'Some error occured'
    })
 } 

 return NextResponse.json({
    status: 200, 
    message: "New user has been created" 
 })


 
}

