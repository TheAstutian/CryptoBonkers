"use client"
import { useContext, useEffect, useState } from "react";
import {Article} from "../db";
import {weighted_title, body_text} from "../fonts";
import Link from "next/link";
import { ArrowRightFromLine } from "lucide-react";
import { userContext } from "../context/contextlibrary";

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL as string 

 export const fetchAuthor = async(userID:string | { name: string; profileUrl: string; bio: string; } | undefined)=>{

  try{
    const API_URL = `${WEB_URL}/api/users/${userID}`
    const fetcher = await fetch(API_URL, {
      method: "GET"
    })
    const author = await fetcher.json()

    if(!author){
      
      return 'no author'
    } 
    
    return author.data.name || author.data

  }catch(err){
    console.log(err)
  }
}

const Hero = () =>{
const [featured_hero, set_featured_hero] = useState<Article | null>(null)
const [allPosts, setallPosts] = useState<Article[]>([])
const [subheroPosts, setSubheroPosts] = useState<Article[]>([])
const [heroAuthorName, setheroAuthorName] = useState ('')
const [opinionArticles, setOpinionArticles] = useState<Article[]>([])
const [guideArticles, setGuideArticles] = useState<Article[]>([])

const useAppContext = useContext(userContext)
const contextValue = useAppContext
const currentUser = contextValue?.currentUser


useEffect(
    ()=>{
      fetchPosts()
    }
    , [])

useEffect(() => {
      const getHeroAuthorName = async () => {
          if (featured_hero?.author) {
              const author = await fetchAuthor(featured_hero.author);
              setheroAuthorName(author || ''); // Ensure it's a string, provide fallback
          } else {
              setheroAuthorName(''); // Clear if no hero or author
          }
      };

      getHeroAuthorName();
  }, [featured_hero?.author])


const fetchPosts = async()=>{
  try{

    const API_URL = `${WEB_URL}/api/posts`
    const fetcher = await fetch(API_URL, { method: "GET" })
    const articles = await fetcher.json()
    if(!articles || !articles.data){
      console.warn("No article data recieved from server")
      setallPosts([]);
      set_featured_hero(null); 
      setSubheroPosts([]);
      return 
    }
    const fetchedArticles: Article[] = articles.data;

    // --- Clear previous states before populating ---
    set_featured_hero(null);
    setSubheroPosts([]);
    

    let foundHero: Article | null = null;
    const tempSubheroPosts: Article[] = [];
    const otherPosts: Article[] = [];
    const opinionPosts: Article[] = [];
    const guidePosts: Article[] = [];

    fetchedArticles.forEach((post:Article) =>{
      
      
      if (post.categories.primary === "Opinions"){
        
        opinionPosts.push(post)
      } 
       if (post.categories.primary === "Guides"){
        guidePosts.push(post)
      }

      if(post.featured_hero && !foundHero) {
        foundHero = post; 
      } else if (post.featured_subhero && tempSubheroPosts.length<6){
        tempSubheroPosts.push(post)
      } else if(otherPosts.length<6){
        otherPosts.push(post)
      }
      
    })

    set_featured_hero(foundHero)
    setSubheroPosts(tempSubheroPosts)
    //setallPosts(fetchedArticles)
    setallPosts(otherPosts)
    setOpinionArticles(opinionPosts)
    setGuideArticles(guidePosts) 
    
  }catch(err){
    console.log(err)
  }
}



/*const setAuthorName = async () =>{

  if(featured_hero){

    let author = await fetchAuthor(featured_hero?.author)
    setheroAuthorName(author)
    console.log('featured one', featured_hero)
    console.log('author ooo', author)
  }
}*/

    return (
        <>
        <div className={`flex flex-col px-5`}> 
    <div className=" grid grid-cols-2 md:grid-cols-14 gap-2"> {/*left layoutsection*/}
      <section className=" col-span-2 md:col-span-4  ">
      <div className="flex gap-3 flex-col mb-3 md:hidden">
          <Link href={`/posts/${featured_hero?.slug}&${currentUser?.link? currentUser.link :''}`}  ><img className="w-full" src={featured_hero?.featuredImage.url} alt={featured_hero?.featuredImage.alt}/></Link>
          <p className="text-xs"><Link className="hover:underline" href={`/categories/${featured_hero?.categories.secondary}`}>{featured_hero?.categories.secondary}</Link></p>
          <Link href={`/posts/${featured_hero?.slug}&${currentUser?.link? currentUser.link :''}`}  > <h2 className={`font-bold text-2xl hover:underline ${weighted_title.className}`}>{featured_hero?.title}</h2></Link>
          <p className={`${body_text.className} `}>{featured_hero?.summary}</p>
          <p className={`text-sm italic text-gray-500`}>{/*featured_hero?.author.name || */ heroAuthorName }</p>
        </div>


        { subheroPosts? subheroPosts.map((article: Article, indexs : number) => {
         if(indexs >= 0 && indexs <= 2)
         return  (
            <>
            <Card variant={"primary"} key={article.slug} article={article}/>           
            </>
          )
        } ):<>   <div className="circ skeleton-content my-3"></div>
        <div className="rect skeleton-content my-3"></div>
        <div className="rect skeleton-content my-3"></div>
        <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
        </> }
 

      </section>
      {/*middle column*/}
      <section className=" col-span-2 md:col-span-7 flex flex-col px-2 md:mx-2 md:mx-10">
        <div className="md:flex gap-5 flex-col mb-3 hidden ">
          <Link href={`/posts/${featured_hero?.slug}&${currentUser?.link? currentUser.link :''}`}  ><img className="w-full" src={featured_hero?.featuredImage.url} alt={featured_hero?.featuredImage.alt}/></Link>
          <p className="text-xs"><Link className="hover:underline" href={`/categories/${featured_hero?.categories.secondary}`}>{featured_hero?.categories.secondary}</Link></p>
          <Link href={`/posts/${featured_hero?.slug}&${currentUser?.link? currentUser.link :''}`} > <h2 className={`font-bold text-2xl hover:underline ${weighted_title.className}`}>{featured_hero?.title}</h2></Link>
          <p className={`${body_text.className} `}>{featured_hero?.summary}</p>
          <p className={`text-sm italic text-gray-500`}>{ heroAuthorName || ""}</p>
        </div>

        <div className="border-t py-5 border-black">
          <div className=" gap-2 border border-black py-10 flex flex-col items-center ">
                <p className={` text-sm ${body_text.className}`}> Subscribe to our newsletter</p>
                <h2 className={`md:text-2xl md:max-w-4/5 max-w-96 font-bold text-center ${weighted_title.className}`}> GET ALL THE LATEST NEWS DELIVERED STRAIGHT TO YOUR INBOX</h2>
                <div className="w-full flex flex-row justify-center pb-1 pt-5">
                <input type="search" name="search" id="search" className="bg-gray-50 border border-black text-gray-900 text-sm focus:ring-black block p-2.5" placeholder="Your.email@example.com" />
                <button type='submit' className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-center text-white bg-black focus:ring-4 hover:text-gray-300 hover:bg-stone-800 border border-black cursor-pointer">Subscribe</button>
                </div>
                <p className="text-xs"> No spam. Unsubscribe at any time.</p>
          </div>
        </div>
        <div className="">

          {subheroPosts.map((article:Article, index: number) =>{
            if (index> 2)
            return (
              <div key={article.slug} className="border-t border-black">
                <Card variant={"tertiary"} key={article.id} article={article} />
             </div> 
            )
          }
          
          
          )} 
        </div>
      </section>

      {/*right column*/}
      <section className=" col-span-2 md:col-span-3 md:flex flex-col ml-3">
        <div className="border-y border-black py-3 flex flex-row justify-between">
          <h2 className="flex font-semibold">Latest Articles</h2>
          <h2 className="flex pr-2">View All <Link href={"/categories/News"}> <ArrowRightFromLine className="mt-1 ml-2" size={18} /> </Link></h2>
        </div>
        <div className="h-48">
        Newsletter Plus latest
        </div>
          {allPosts.map((article:Article) =>{
            return (
              <Card variant="secondary" key={article.id} article={article} />
            )
          })} 
      </section>

    </div>
   
  </div>

  

  
        <section className=" my-5">
      
        <div className="border-y border-black py-3 flex flex-row justify-between">
                <h2 className="pl-5 flex font-semibold">OPINIONS</h2>
                <h2 className="flex pr-2">View All <Link href={"/categories/Opinions"}> <ArrowRightFromLine className="mt-1 ml-2" size={18} /> </Link></h2>
              </div>
      
        <div className="flex overflow-x-auto flex-nowrap space-x-4">
          {
            opinionArticles.map((article:Article) =>(
              <div key={article.slug} className="flex-none overflow-hidden w-100 px-6">
                <Card variant="full" key={article.title} article={article} />
                </div>
            ))
          }
        </div>
      
        </section>
      
        <section>
      
        <div className="border-y border-black py-3 flex flex-row justify-between">
                <h2 className="pl-5 flex font-semibold">GUIDES</h2>
                <h2 className="flex pr-2">View All <Link href={"/categories/Guides"}> <ArrowRightFromLine className="mt-1 ml-2" size={18} /> </Link></h2>
              </div>
      
              <div className="flex overflow-x-auto flex-nowrap space-x-4">
          {
            guideArticles.map((article:Article) =>(
              <div key={article.slug} className="flex-none overflow-hidden w-100 px-6">
                <Card variant="full" key={article.title} article={article} />
                </div>
            ))
          }
        </div>
        </section>
        </>
    )
}

export function convertTimestampToDDMMYY(timestamp: number | string): string {
  // Ensure the timestamp is a number. If it's a string, parse it.
  const numericTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;

  // Check if the parsed timestamp is valid
  if (isNaN(numericTimestamp) || numericTimestamp <= 0) {
    return "Invalid Timestamp";
  }

  const date = new Date(numericTimestamp);

  // Get day (1-31)
  const day = date.getDate();
  // Get month (0-11, so add 1)
  const month = date.getMonth() + 1;
  // Get full year (e.g., 2025)
  const year = date.getFullYear();

  // Pad day and month with a leading zero if they are single digits
  const formattedDay = String(day).padStart(2, '0');
  const formattedMonth = String(month).padStart(2, '0');

  // Get the last two digits of the year
  const formattedYear = String(year).slice(-2);

  return `${formattedDay}/${formattedMonth}/${formattedYear}`;
}

 export function Card ({variant, article}:{
  variant: string; article: Article;
}){

  const [authorName, getAuthorName] = useState (''); 
  const useAppContext = useContext(userContext)
  const contextValue = useAppContext
  const currentUser = contextValue?.currentUser
  
  useEffect(()=>{
    getAuthor()
  },[])

  const {categories, slug, title, summary, featuredImage, publishedAt} = article; 


const getAuthor = async () =>{
  const author = await fetchAuthor(article.author)
  if (author){
    return   getAuthorName(author)
  }
else return 'No Author'
}
  if (variant==="primary"){

    return (
      <>
    <div className="flex gap-4 flex-col border-t border-black py-5">
              <p className="text-xs"><Link className="hover:underline" href={`/categories/${categories.secondary}`}>{categories.secondary}</Link></p>
              <Link href={`/posts/${slug}&${currentUser?.link? currentUser.link :''}`} > <h2 className={`font-bold text-2xl hover:underline ${weighted_title.className}`}>{title&&title}</h2></Link>
              <Link href={`/posts/${slug}&${currentUser?.link? currentUser.link :''}`} ><img src={featuredImage?.url} alt={featuredImage?.alt}/></Link>
              <p className={`${body_text.className} `}>{summary&&summary}</p>
              <p className={`text-sm italic text-gray-500`}>{authorName&&authorName}</p>
            </div>
      </>
    )
    // {`/posts/${slug}&${currentUser?.link? currentUser.link :''}`} 
  }

   if (variant==="secondary"){
    return (
      <div className="flex flex-col border-t border-black gap-5 py-5 ">
        <p className="text-xs "> <Link className="hover:underline" href={`/categories/${categories.secondary}`}>{categories.secondary}</Link> - {convertTimestampToDDMMYY(publishedAt)}</p>
        <Link href={`/posts/${slug}&${currentUser?.link? currentUser.link :''}`} > <h3 className={`font-bold hover:underline text-xl ${weighted_title.className}`}>{title}</h3></Link>
        <Link href={`/posts/${slug}&${currentUser?.link? currentUser.link :''}`} ><img className=" w-1/2 " src={featuredImage.url} alt={featuredImage.alt}/></Link>
      </div>
    )
  }

  if (variant==="tertiary"){
    return (<div className="flex flex-row gap-5 my-2 py-5 ">
      <div className="flex flex-1 flex-col my-auto gap-2">
        <p className=" text-sm">
          <Link className="hover:underline" href={`/categories/${categories.secondary}`}>{categories.secondary}</Link>
        </p>
        <Link href={`/posts/${slug}&${currentUser?.link? currentUser.link :''}`} > <h3 className={`font-bold text-xl hover:underline ${weighted_title.className}`}>{title}</h3></Link>
        <p className={`text-sm italic text-gray-500`}>{authorName}</p>
        
        </div>
      <div className="flex flex-1">
      <Link href={`/posts/${slug}&${currentUser?.link? currentUser.link :''}`} ><img src={featuredImage.url} alt={featuredImage.alt}/></Link>
      </div>
    </div>)
  }

  if (variant==="full"){
    return (
      <div className="flex gap-4 flex-col py-5">
              <p className="text-xs "> <Link className="hover:underline" href={`/categories/${categories.secondary}`}>{categories.secondary}</Link> - {convertTimestampToDDMMYY(publishedAt)}</p>  
              <Link className="h-24" href={`/posts/${slug}&${currentUser?.link? currentUser.link :''}`} > <h2 className={`font-bold text-2xl hover:underline ${weighted_title.className}`}>{title}</h2></Link>
              <Link href={`/posts/${slug}&${currentUser?.link? currentUser.link :''}`} ><img src={featuredImage.url} alt={featuredImage.alt}/></Link>
              <p className={`${body_text.className} `}>{summary}</p>
              <p className={`text-sm italic text-gray-500`}>{authorName&&authorName}</p>
            </div>
    )
  }

}  



export default Hero; 