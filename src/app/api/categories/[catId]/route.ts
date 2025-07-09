import { NextResponse } from "next/server";
import { ArticleDB } from "@/lib/model";
import connectDB from "@/lib/mongodb";

export async function GET (request: Request, {params} : {params: Promise<{catId: string}>}) {

    const categoryId = await params;
    const catId = categoryId.catId 
    if(!catId) {
        return NextResponse.json({
            message: "error, no category selected"
        }, {status: 404})
    }
    
    try{
        await connectDB()
        const categoryArticles = await ArticleDB.find({
            $or: [
                {"categories.primary" : catId }, 
                {"categories.secondary": catId }
            ]
        })

        if(!categoryArticles){
            return NextResponse.json({
                message: "No articles found", 
            },{status: 400})
        }
        return NextResponse.json({
            message: "success", 
            data: categoryArticles
        }, {status: 200})

    }catch(error){
        return NextResponse.json({
            message: "Some error occured",
            error: error
        }, {status: 400})
    }
     
}