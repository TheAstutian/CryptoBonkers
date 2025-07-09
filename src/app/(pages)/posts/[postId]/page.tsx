
import article_database, { Article } from "@/app/db";
import parse from 'html-react-parser';
import Head from "next/head";
import Script from "next/script";
import React from 'react';  
import { body_text } from "@/app/fonts";
import { ArticleDB } from "@/lib/model";
import {JSDOM} from 'jsdom'
import Link from "next/link";
import DeleteButton from "@/app/components/DeleteButton";

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL as string 
//This function converts timestamp to D,M format, e.g Mar. 20
const convertTimestampToDDMMYY = (timestamp: number | string): string => {
   
  const numericTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  if (isNaN(numericTimestamp) || numericTimestamp <= 0) {
    return "Invalid Timestamp";
  }

  const date = new Date(numericTimestamp);

  const monthAbbrevations = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

  const day = date.getDate();
  const month = monthAbbrevations[date.getMonth()];
  const year = date.getFullYear();  

  // Pad day and month with a leading zero if they are single digits
  const formattedDay = String(day).padStart(2, '0');
  const formattedMonth = String(month).padStart(2, '0');  
  const formattedYear = String(year).slice(-2);     // Get the last two digits of the year


  if (Number(formattedYear) && Number(formattedYear)>2025) {
    return `${formattedDay}/ ${formattedMonth}/ ${formattedYear}`;
  }

  return `${formattedMonth}. ${formattedDay} `;
}
//Converts timestamps to a more adroit format. 
const relativeTime = (timeStamp:string) =>{
  const convertedDate = Number(timeStamp)
  const date = convertedDate
  const now = Date.now()
  const diffSeconds = (date-now)

  const rtf = new Intl.RelativeTimeFormat('en', {numeric: 'auto'})

  if (Math.abs(diffSeconds) < 60000) { 
    return rtf.format(Math.round(diffSeconds), 'second'); 
  } else if (Math.abs(diffSeconds) < 3600000) {  
    return rtf.format(Math.round(diffSeconds / 60000), 'minute'); 
  } else if (Math.abs(diffSeconds) < 86400000) {
     return rtf.format(Math.round(diffSeconds / 3600000), 'hour'); 
    } else if (Math.abs(diffSeconds) < 604800000) { 
      return rtf.format(Math.round(diffSeconds / 86400000), 'day'); 
    } else if (Math.abs(diffSeconds) < 2629800000) { 

      const oldertime= convertTimestampToDDMMYY(timeStamp)
      return oldertime 
     }
}

//fetches author using author's ID 
const fetchAuthor = async(userID: string)=>{
  try{
    const API_URL = `${WEB_URL}/api/users/${userID}`
    const fetcher = await fetch(API_URL, {
      method: "GET"
    })
    const author = await fetcher.json()

    if(!author){
      
      return 'Not available'
    } 
    return author   
  }catch(err){
    console.log(err)
  }
}

//separates URLs into post slug and userID
const separateSlugAndID =(inputString: string) => {
  const separatorIndex = inputString.indexOf('%');
  if (separatorIndex === -1){
    console.warn("separator not found")
    return {slug: inputString, id: null}
  }
  const slug = inputString.substring(0, separatorIndex) //postslug
  const id = inputString.substring(separatorIndex + 1) //currentuserID

  return {slug, id}
}

//Time to read article
const getReadingTime = (content:string) =>{
  const wordsPerMinute = 200; 
  const secondsPerImage = 1 

  const dom = new JSDOM(content)
  const doc = dom.window.document; 
  const articleElement = doc.querySelector('article') || doc.body; 

  const text = articleElement.textContent || ""; 
  const cleanText = text.replace(/\s+/g, ' ')
  const wordCount = cleanText.split(' ').filter((word: string) => word.length > 0).length; 
  const imageCount = articleElement.querySelectorAll('img').length;
  const textReadingTimeMinutes = wordCount/wordsPerMinute; 
  const imageReadingTimeMinutes = (imageCount * secondsPerImage)
  const totalReadingTime = textReadingTimeMinutes + imageReadingTimeMinutes
   
   if (totalReadingTime<1){
    return Math.ceil(totalReadingTime) + " min read"
   } 
   return  Math.ceil(totalReadingTime) + " mins read"
  
}

const Post = async ({ params }: { params: Promise<{ postId: string }> }) => {
    const postIdSluger = await params 
  const postIdSlugs = postIdSluger.postId
const infoForFetch = separateSlugAndID(postIdSlugs)
const postIdSlug = infoForFetch.slug

const currentPost = await ArticleDB.findOne({slug: postIdSlug}) //fetch article using slug
const post = article_database.find(article => article.slug === postIdSlug) || currentPost

const authorDetails = await fetchAuthor(post.author)
 
const publishedTime = relativeTime(post.publishedAt)


const readingTime = getReadingTime(post?.content)
  
//Santizing and parsing the content
  const renderSanitizedContent = (article: Article | undefined) => {
    if (article?.content) {
      return parse(article.content);
    }
    return null; // Or some other fallback if content is missing
  };

  const relatedPosts = await ArticleDB.find({
    'categories.secondary': post?.categories.secondary
  })

  return (
    <>
    <Head> 
        <title>{post?.seo.metaTitle}</title>
        <meta name="description" content={post?.seo.metaDescription} />
        <meta name="keywords" content={post?.seo.keywords} />
        <link rel="canonical" href={post?.seo.canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={post?.seo.ogTitle}/>
        <meta property="og:description" content={post?.seo.ogDescription}/>
        <meta property="og:image" content={post?.seo.ogImage}/>

      

    </Head>
    <article className=" px-2 lg:w-3/7 md:px-10 md:mx-10 lg:mx-auto gap-5 pb-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold pb-2">{post?.title}</h1>
        <section className="flex flex-col gap-3 pt-5 pb-5">
            <p className=" w-full flex-initial text-sm italic ">{post?.summary}</p>
            <section className="pl-2 flex flex-row gap-5 ">
                <div className=" ">
               <Link href={`/users/${authorDetails?.data.id}`}> <img src={authorDetails?.data?.image} className="w-10 h-10 rounded-full"/></Link>
                </div>
                <div>
                    <p className="font-semibold text-gray-600 text-sm">{authorDetails.data.name}</p>
                    <p className="italic text-xs text-gray-600">{publishedTime} - {readingTime} </p>
                </div>

                {infoForFetch.id===null || infoForFetch.id!='26'? 
                <div className=" w-100 py-2.5 flex flex-row place-content-end gap-3 ">
                  <p className="text-sm border border-gray-400 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-100 grid  "><Link href ={`/posts/${postIdSlug}/edit`}>Edit </Link></p>
                 <DeleteButton 
                 slug={postIdSlug}  
                 />
                </div>: 
                ""}
            </section>
        </section>
        <img className="w-full pb-2" src={post?.featuredImage.url} />
        <p className="pl-1 pb-4 text-sm"><b><Link className="hover:underline" href={`/categories/${post.categories.primary}`}>{post.categories.primary}</Link></b> - {post.categories.secondary}</p>
    <section className={`${body_text.className} prose md:text-xl/8 pt-3 gap-3`}>{renderSanitizedContent(post)}</section>
    </article> 


    <section className="pt-5 md:pt-10 pb-10 border-t border-gray-300 flex flex-col gap-3 md:px-10 md:mx-10 justify-items-center">
        <div className="flex justify-center w-full  ">
        <h2 className=" text-xl md:text-3xl p-2 pb-5">Related posts</h2>
        </div>


        <div className="flex flex-col md:flex-row gap-2 mx-auto ">
      {relatedPosts.map((item:Article)=>{
            if (item.slug === post.slug){
              return null
            }

        return (
          <div  key={item.title} className="border border-gray-100 mx-3 px-3 md:px-5 w-[250px] py-5 md:w-[350px] mb-5">
            <Link href={`/posts/${item.slug}&${infoForFetch.id}`} > 
            <img className='pb-5' src={item.featuredImage.url} />
            </Link>            
            <Link href={`/posts/${item.slug}&${infoForFetch.id}`} > 
            <p className="hover:underline text-sm md:text-md">{item.title}</p>
            </Link>
          </div>
        )
        })}
        </div>
        
    </section>
    <Script id="structured-data-script" type="application/Id+json">
        {JSON.stringify(post?.seo.structuredData)}
        </Script>
    </>
  );
};



export default Post;