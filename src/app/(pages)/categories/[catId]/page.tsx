"use client"

import { Article } from "@/app/db";
import Link from "next/link";
import { useEffect, useState } from "react";
import React from "react";
import { fetchAuthor, Card } from "@/app/components/hero";

const API_URL = process.env.NEXT_PUBLIC_WEB_URL as string 
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

export default function Category ({ params }: {params: Promise<{ catId: string;}>}) {
const [displayedArticles, setDisplayedArticles] = useState <Article []> ([])
const [currentUserlink, setCurrentUserlink] = useState<string>('')
const [catName, setCatName] = useState<string>('')
const [author, setAuthor] = useState<string>('')


    useEffect(()=>{
        fetchArticles()
    },[catName])

    const fetchArticles = async () =>{
        const catIDslug = await params; 
        const catIdSlugs = catIDslug.catId
        setCatName(catIdSlugs)
        const FETCH_ARTICLES_API = `${API_URL}/api/categories/${catIdSlugs}`
        const articles = await fetch(FETCH_ARTICLES_API, {method: 'GET'})
        const fetched_articles = await articles.json()
        const reversed = fetched_articles.data.reverse()
        setDisplayedArticles(reversed)
        const theAuthor = await fetchAuthor(fetched_articles.data[0].author)
        setAuthor(theAuthor)

        if (typeof window !== 'undefined' && window.localStorage){
            const storedUser = localStorage.getItem('user')
            if(storedUser){
                const userObject = JSON.parse(storedUser) 
                setCurrentUserlink(userObject)              
                 }
             }
    }

    return (
        <>
        {
            displayedArticles.length>0? 
        
       ( <React.Fragment key="content-loaded">
            <h2 className="md:py-3 text-xl md:text-4xl px-5 mx-3 ">{catName}</h2>
        <div className="flex flex-col md:flex-row p-2 gap-3 mx-auto">
        
        <div className="p-5 md:p-2 md:w-5/7">
            <Link href={`/posts/${displayedArticles[0]?.slug}&${currentUserlink}`}>
                <img className="pb-3" src={displayedArticles[0]?.featuredImage.url} />
                <p className="sm:px-3 md:text-2xl hover:underline cursor-pointer">{displayedArticles[0]?.title}</p>
                <p className="text-sm text-gray-700 py-2 italic">{displayedArticles[0]?.summary}</p>
                <div className="flex pt-2 flex-col p-1">
                 
                    <p className="text-gray-500 italic text-sm md:mr-10">By {author} - {relativeTime(displayedArticles[0].publishedAt)}</p>
                </div>
            </Link>
           
        </div>

        <div className="flex flex-col p-5 md:p-2 md:w-2/7 ">
        {displayedArticles.length>1? (
        <div className="flex flex-col px-1 pb-3 mb-2" >
             <Link href={`/posts/${displayedArticles[1]?.slug}&${currentUserlink}`}>
             <img className="pb-2 mx-auto" src={displayedArticles[1]?.featuredImage.url} />
             <p className=" md:text-sm hover:underline cursor-pointer">{displayedArticles[1]?.title}</p>
             </Link>       
             <div className="flex pt-2 flex-col p-1">
                 <p className="text-gray-500 italic text-sm md:mr-10">{relativeTime(displayedArticles[1]?.publishedAt)}</p>
             </div>
        </div>
        ):('')}

        {displayedArticles.length>2? (
             <div className="flex flex-col px-1">
             <Link href={`/posts/${displayedArticles[2]?.slug}&${currentUserlink}`}>
             <img className="pb-2" src={displayedArticles[2]?.featuredImage.url} />
             <p className=" md:text-sm hover:underline cursor-pointer">{displayedArticles[2]?.title}</p>
             </Link>
     
             <div className="flex pt-2 flex-col p-1">
                  <p className="text-gray-500 italic text-sm md:mr-10">{relativeTime(displayedArticles[2]?.publishedAt)}</p>
              </div>
             </div>
        ): ('')}
        </div>
        </div>

        <div className="sm:pt-5">
            {displayedArticles.map((article:Article, index:number)=>{
                if (index>2) {
                    return (
                        <div className=" border border-gray-300 p-2 sm:p-5 sm:w-2/3 md:w-1/2 mx-auto " key={article.title}>
                          <p className="text-gray-500">{relativeTime(article.publishedAt)}</p>
                             <Card variant={"tertiary"} key={article.id} article={article} />
                        </div>    
                   )
                }
            })
            }
        </div> 
        </React.Fragment> )
        : 
        <p key="loading-state">Loading</p>
    }
    </>
    )
}


