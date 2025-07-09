import { UserDB } from "@/lib/model";
import { NextResponse } from "next/server"
import { z } from "zod";


export async function GET (request: Request, { params }: { params: { userId: string } }) {

    const userID = await params;
    const hexRegex = /^[0-9a-fA-F]{24}$/
    if(!hexRegex.test(userID.userId)){
        if(typeof userID.userId!= 'number'){
            return NextResponse.json({
                status: 200, 
                message: "can't find user", 
                data: userID.userId 
            })
        }
    }
    if (userID )
    
    try {
        const userIDObject = new Object(userID.userId)

        const userExists = await UserDB.findOne({
            _id: userIDObject
        })
        if(!userExists) {
            return NextResponse.json({
                status: 404, 
                message: 'failed', 
                error: "Error, user does not exist"
            }, {status:404})
        } 
        const userForClient = {
            id: userExists._id, 
            username: userExists.username,
            email: userExists.email, 
            image: userExists.image,
            name: userExists.name, 
            bio: userExists.bio
        }

        console.log('User fetched')

        return NextResponse.json({
            status: "OK", 
            data: userForClient
        }, {status: 200})

    }catch (error){
        console.log(error)
        return NextResponse.json({
            status: 500, 
            message: "failed", 
            error: "Some other error", 
            
        }, {status: 400})
    }
  

   


     return NextResponse.json({
            status: 400, 
            message: "Success",
            data: "This worked"
        }, {status: 400})
}

const updateUserSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string().email("Invalid email address"), 
    image: z.string().optional(),
    name: z.string(),
    bio: z.string().optional(), 
})



export async function PUT  (request: Request) {

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
     
     const validatedDataFromClient = updateUserSchema.safeParse(requestBody)
    
    if (!validatedDataFromClient.success) {
        return NextResponse.json({
            status: 400, 
            message: "Invalid request body", 
            errors: validatedDataFromClient.error.flatten().fieldErrors
        }, {status:400})
    }
    
    const { id, email, name, username, image, bio} = validatedDataFromClient.data

    const updateFields: { [key: string]: string } = {};
    if (email !== undefined) updateFields.email = email;
    if (name !== undefined) updateFields.name = name;
    if (username !== undefined) updateFields.username = username;
    if (image !== undefined) updateFields.image = image;
    if (bio !== undefined) updateFields.bio = bio;

    //DB gymnastics 
    let idObject;  
    try {
        idObject = new Object(id);
    }catch(err){
        console.log(err)

        return NextResponse.json({
            status: 400, 
            message: "error turning iD to object", 
        }, {status: 400})
    }

    const userExists = await UserDB.findOne({
        _id: idObject
    })
    if (userExists) {
        //update user here

        try {
            const updatedUser = await UserDB.findOneAndUpdate(
                {_id: idObject}, 
                {$set: updateFields }, 
                {new: true, runValidators: true}
            )
            if (updatedUser){
                return NextResponse.json({
                    status: 200,
                    message: "User updated successfully", 
                    user: updatedUser
                }, {status:200})
            } else {
                return NextResponse.json({
                    status: 404, 
                    message: "User not found after initial check"
                }, {status:404})
            }
        }catch(error){
            console.error("Error updating user:", error);
                return NextResponse.json({
                    status: 409, // Conflict
                    message: "A user with this username or email already exists.",
                }, { status: 409 });
        
            }
    } if(!userExists){
        return NextResponse.json({
            status:400,
            message: "error occured"
        }, {status: 400})
    }
 
}

 