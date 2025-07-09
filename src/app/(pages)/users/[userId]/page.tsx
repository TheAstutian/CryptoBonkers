
"use client"
import Link from "next/link";
import { useEffect, useState } from "react";


type Author = {
    id: string 
    username: string
    email: string
    image: string
    name: string
    bio: string
} 
const API_URL = process.env.NEXT_PUBLIC_WEB_URL as string 

interface PageProps {
    params: {
        userId: string
    };
  }

const User =  ({ params }: PageProps) =>{
 
    const [author, setAuthor] = useState<Author | null>(null);
    const [authorizedUser, setAuthorizedUser] = useState (false)
    
        useEffect (()=>{
            fetchUser()
        }, [])

    const fetchUser = async ()=>{

        try{
            const userId =  await params.userId; 
            const USER_API_ENDPOINT =  `${API_URL}/api/users/${userId}`; 
            const response = await fetch(USER_API_ENDPOINT, {
                method: "GET"         
            })
           const result = await response.json()
            setAuthor(result.data)

            if (typeof window !== 'undefined' && window.localStorage){
                const storedUser = localStorage.getItem('user')
                if(storedUser){
                    const userObject = JSON.parse(storedUser)
                    if(userObject.email === result.data.email){
                        setAuthorizedUser(true)
                     } else setAuthorizedUser(false)
                }
            }
            // compare emails 
       }catch(error){
            console.log("Login API call error:", error);
            
            return (
                <div className="p-3 flex flex-col w-full h-[650px]">

            <h1 className="text-red-700 text-3xl py-10 mx-auto"> Error 404</h1>
            <p className="text-red-700 text-md mx-auto  "> This writer does not exist</p>
            
        </div>
            )
        } 
    }


    return (
        <div className="p-3">
           
            
            {author? 
            
            <div className="flex flex-col px-10 gap-3 mx-auto ">
                <div className="flex flex-row space-between">
                 <h2 className=" text-xl p-2 sm:text-3xl pb-5">{author.name}</h2> 
                 {authorizedUser? <Link href={`${API_URL}/users/${params.userId}/edit`} className="p-3 cursor-pointer"><span className="p-2 border border-black rounded-xs hover:bg-gray-100">Edit Profile</span></Link>: null}
                 </div>
                <img src={author.image} className="h-[200px] w-[200px] rounded-full"/>
                <p className="pt-3 pb-20 sm:py-5 sm:w-1/2">
                    {author.bio}
                </p>
                
            </div>
            :
            <div className="px-10">
            <h2 className=" text-xl p-2 sm:text-3xl p-3">Writer  Profile </h2>
            <div className="circ skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rect skeleton-content my-3"></div>
            <div className="rectbig skeleton-content my-3"></div>
            </div>}

        </div>
    )  
   }
 

 
export default User; 