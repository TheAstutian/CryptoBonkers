import { NextResponse } from "next/server";
import { ArticleDB } from "@/lib/model";

export async function GET (request: Request, {params} : {params: {catId: string}}) {

    const categoryId = await params;
    const catId = categoryId.catId 
    if(!catId) {
        return NextResponse.json({
            message: "error, no category selected"
        }, {status: 404})
    }
    
    try{
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
    
    return NextResponse.json({
        message: "Generic",
        data: 'Sample String'
    }, {status: 400})
}