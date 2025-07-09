import { ArticleDB, UserDB } from "@/lib/model";
import { NextResponse } from "next/server"
import { z } from "zod";
import { slugify } from "../write/route";

const siteUrl = process.env.NEXT_PUBLIC_WEB_URL as string 


export async function GET (request: Request, { params }: { params: Promise<{ postId: string }> }) {

    const postId = await params;
    const articleId = postId.postId
    
    try {
        const article = await ArticleDB.findOne({slug: articleId})
        if(!article){
            return NextResponse.json({
                status:404,
                message: "Not found"
            }, {status: 404})
        }
        
        return NextResponse.json({
            status:200,
            message: "post fetched successfully", 
            data: article
        }, {status:200})
      
    }catch(err){
        console.log(err)
        return NextResponse.json({
            status:400,
            message: "error in retrieving post"
        }, {status:400})
    }
    return NextResponse.json({
        status: 400,
        message: "Went well", 
    }, {status: 400})

}

//id, title, primary_category, secondary_category, image:image_url, hero, subhero, article, summary, post,  author

const updatePostSchema = z.object({
    author: z.string(),
    id: z.string(),
    title: z.string(), 
    primary: z.string(), 
    secondary: z.string(),
    image: z.string(), 
    hero: z.boolean(),
    subhero: z.boolean(),
    article: z.boolean(), 
    summary: z.string(), 
    post: z.string() 
})


export async function PUT (request: Request) {
    
    let requestBody;
  try {
    requestBody = await request.json()

    const validatedDataFromClient = updatePostSchema.safeParse(requestBody)

    if (!validatedDataFromClient.success) {
        return NextResponse.json({
            status: 400, 
            message: "Invalid request body", 
            errors: validatedDataFromClient.error.flatten().fieldErrors
        }, {status:400})
    }
    const { author, id, title, primary, secondary, image, hero, subhero, article, summary, post} = validatedDataFromClient.data
    

    const authorIdObject = new Object(author)

    const isUserValid = await UserDB.findOne({_id: authorIdObject})
    if(!isUserValid){
        return NextResponse.json({
            status: 404,
            message: "User not found"
        }, {status:404})
    }

    const postIdObject = new Object(id)
    const isPostValid = await ArticleDB.findOne({_id: postIdObject})
    if(!isPostValid){
        return NextResponse.json({
            status: 404,
            message: "Post not found"
        }, {status:404})
    }

    const updatedArticle = {
        title, 
        slug: slugify(title),
        categories: {
            primary: primary,
            secondary: secondary
        },
        featured_hero:hero,
        featured_articles:article,
        featured_subhero:subhero,
        updatedAt: Date.now(), 
        excerpt: summary,
        content: post, 
        summary,
        featuredImage: {
            url: image,
            alt: title,
            width:1920,
            height:1080
        },
        seo: {
            metaTitle: title, 
            metaDescription: summary, 
            keywords: 'tag', 
            canonicalUrl: `${siteUrl}/${slugify(title)}`,
            ogTitle: title, 
            ogDescription: summary, 
            ogImage: image,
            twitterTitle: title, 
            twitterDescription: summary,
            twitterImage:image, 
            twitterCard: `${siteUrl}/${slugify(title)}`,
            structuredData: {
                '@context': `${siteUrl}/${slugify(title)}`,
                '@type': 'Article', 
                headline: title, 
                description: summary, 
                image: image, 
                dateModified: Date.now, 
                author: {
                    '@type': 'Person', 
                    name: 'Sample name', 
                    url: 'profile of Author', 
    
                }, 
                publisher: {
                    '@type': 'Organization', 
                    name: 'CryptoBunker Pro', 
                    logo: {
                        '@type': 'ImageObject', 
                        url: `${siteUrl}`,
                    }
                }
            }
        }
    }
    const updatedPost = await ArticleDB.findOneAndUpdate(
        {_id: postIdObject}, 
        {$set: updatedArticle }, 
        {new: true, runValidators: true}
    )
    if (updatedPost){
        return NextResponse.json({
            status: 200,
            message: "User updated successfully", 
           url: updatedPost.slug
        }, {status:200})
    } else {
        return NextResponse.json({
            status: 404, 
            message: "Post not found after initial check"
        }, {status:404})
    }

    return NextResponse.json({
        status: 400,
        message: "Placeholder",
        data: slugify(title)
      }, {status: 400})

  }catch(err){
    console.log(err)
    return NextResponse.json({
        status: 400,
        message: "some error occurred", 
    }, {status: 400})
  }



  return NextResponse.json({
    status: 400,
    message: "Placeholder",
    data: "gone through"
  }, {status: 400})
}

export async function DELETE (request: Request, { params }: { params: Promise<{ postId: string }> }){
    
     try {
        const postId = await params;
        const slug = postId.postId
        console.log(slug,'here')
        if (!slug){
            return NextResponse.json({message: "Post Id required"}, {status:400})
        }

       const deletedPost = await ArticleDB.findOneAndDelete({slug})

      if(!deletedPost){
        return NextResponse.json({message: 'Post not found'}, {status: 404 })
      }
      return NextResponse.json({message: 'Post deleted successfully'}, {status: 200})
        return NextResponse.json({
            status: 400, 
            message: "just checking"
        }, {status: 400})

    }catch(error){
        return NextResponse.json({
            message: 'Internal Server Error', error: (error as Error).message,
        }, {status: 500})
    }
}
