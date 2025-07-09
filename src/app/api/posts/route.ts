import { NextResponse } from "next/server"
import { ArticleDB } from "@/lib/model"

export async function GET () { 

    try {
        const allPosts = await ArticleDB.find().sort({publishedAt: -1});
        
        if(!allPosts){
            return NextResponse.json({
                status: 400,
                message: "Server error",
            },{status:400})
        }
        return NextResponse.json({
            status:200, 
            message: "Article fetched", 
            data: allPosts
        })
    }catch (err){
        console.log(err)
        return NextResponse.json({
            status: 400,
            message: "Some error occurred", 
            error: err
        }, {status: 400})
    }
}