 import { ArticleDB } from "@/lib/model";
import {z} from 'zod'; 
import { NextResponse } from "next/server"; 

const getPostSchema = z.object({
    title: z.string().min(10,"Title cannot be less than 10 characters"), 
    primary_category: z.string(),
    secondary_category: z.string(),
    image: z.string(),
    hero: z.boolean(),
    subhero: z.boolean(),
    article: z.boolean(),
    author: z.string(),
    summary: z.string().min(6, "Summary must be at least 6 characters long"),
    post: z.string().min(10,'Post must be more than 10 characters'),
})

const siteUrl = process.env.NEXT_PUBLIC_WEB_URL as string 
 const slugify = (str:string)=>{
    str = str.replace(/^\s+|\s+$/g, ''); //trim leading or trailing white spaces
    str = str.toLowerCase();
    str = str.replace(/[^a-z0-9 -]/g, '') //removes non-alphanumeric characters
              .replace(/\s+/g, '-') //replaces spaces with hyphens
              .replace(/-+/g, '-') //removes consecutive hyphens 
    return str
  } 


export async function POST(request: Request) {


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
        const validatedDataFromClient = getPostSchema.safeParse(requestBody.new_article)
    
    if (!validatedDataFromClient.success) {
        return NextResponse.json({
            status: 400, 
            message: "Invalid request body", 
            errors: validatedDataFromClient.error.flatten().fieldErrors
        }, {status:400}) 
    }
    const { title, primary_category, secondary_category, image, hero, subhero, article, summary, post, author} = validatedDataFromClient.data

    console.log('here', validatedDataFromClient.data)

const newArticle = {
    title, 
    slug: slugify(title),
    categories: {
        primary: primary_category,
        secondary: secondary_category
    },
    featured_hero:hero,
    featured_articles:article,
    featured_subhero:subhero,
    author: author, 
    publishedAt:  Date.now(),
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
            datePublished: Date.now, 
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
//console.log('new article o', newArticle)

try{
    const checkDuplicate =  await ArticleDB.findOne({title: title})
    if(checkDuplicate){
        console.log("error adding new posts. Possible duplicate")
        return NextResponse.json({
            status: 400, 
            message: "Article already exists"
        }, {status:400})
    } 
    const addNewArticle = await ArticleDB.insertOne(newArticle)
    if (!addNewArticle){
        console.log("Error adding new article")
        return NextResponse.json({
            status: 400,
            message: "There was an error adding the new article"
        })
    } 
    console.log("New Article added")
    console.log(addNewArticle)
    return NextResponse.json({
        status: 200, 
        message: "New article successfully added", 
        data: addNewArticle
    }, {status: 200})


}catch(error){
    console.log(error)
    return NextResponse.json({
        status: 400, 
        message: "error posting new article", 
        error: error
    }, {status:400})
}
console.log('new a', newArticle)
return NextResponse.json({
    status:400,
    message:"OK",
    data:"This is a sample data "
}, {status: 400})

}