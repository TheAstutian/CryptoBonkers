"use client" 


import { FormEvent, useEffect, useState } from "react";
import { useRouter} from 'next/navigation'; 
import {useParams } from 'next/navigation'; 
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_WEB_URL as string 

type Author = {
    id: string 
    username: string
    email: string
    image: any
    name: string
    bio: string
}

const EditUser = () =>{
const [user, setUser] = useState<Author | null>(null)
const [error, setError] = useState<string | null> ("")

    const router = useRouter()
   const params = useParams()
   const userId = params.userId

    useEffect (()=>{
      loadUser()
    }
    , [])

    const loadUser = async()=>{

        if (!userId) {
            
            console.error("User ID is not available.");
            router.push("/");  
            
        }
        if (typeof window !== 'undefined' && window.localStorage){
            const storedUser = localStorage.getItem('user')
            if(storedUser){
                try{

                    const USER_API_ENDPOINT =  `${API_URL}/api/users/${userId}`;
                   
                    const response = await fetch(USER_API_ENDPOINT, {
                        method: "GET"         
                    })
                   const result = await response.json()
                   
                    setUser(result.data)
                }catch(error){
                    localStorage.removeItem('user')
                    router.push("/")
                }
            }
            if(!storedUser){
                router.push("/")
              }
            }
        } 

        const imageUpload = async (file: File) =>{
            const img_api = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API as string
            if (!img_api) {
                throw new Error("The ImgBB API key is not configured in the environment variables.");
            }
            const image_upload = new FormData();
                
                    image_upload.set('key', img_api)
                    image_upload.append('image',file)
                    const reply = await fetch('https://api.imgbb.com/1/upload', {
                      method: 'POST',
                      body: image_upload,
                    });
                    if (!reply.ok){
                      throw new Error (`Image upload failed with status: ${reply.status}`)
                    }
                    const responseData = await reply.json();
                    return responseData.data.url as string; 
          }

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { 
    const { name, value } = e.target; 

    setUser(prevUser => {
        if(!prevUser){
            console.warn("Not valid")
            return {
                id: '',
                username:'',
                email:'',
                name:'',
                bio:'',
                [name]: value,
            } as Author; 
        }
        return {
            ...prevUser, [name]: value
        } as Author; 
    }); 
};

const imageChange = async (e: React.ChangeEvent<HTMLInputElement>) =>{
    const {name} = e.target
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const newvalue = await imageUpload(file)
        console.log(newvalue)

        setUser(prevUser => {

            if (!prevUser){
                console.warn('No user')
                return null 
            } 
            return {
                 ...prevUser, [name]: newvalue 
            }  as Author
        })
           
        
    }
     
    
}
const handleSubmit = async (event: FormEvent<HTMLFormElement>) =>{
    event.preventDefault() 

    if (!user) {
        setError("User data is not loaded yet.");
        return;
    } 

    setError(null)
 

    
    const dataToUpdate = {
        id: user.id, // Important: Send the ID so the server knows which user to update
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        image: user.image, 
    };
    try {
        const USER_API_ENDPOINT =  `${API_URL}/api/users/${userId}`;
        const response = await fetch (USER_API_ENDPOINT, {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(dataToUpdate)
        })

        if(!response.ok){
            const errorData = await response.json(); 
            throw new Error(errorData.message || "Failed to update user")
        }

        const result = await response.json(); 
        alert("Update is a success")
        router.push(`/users/${userId}`)

    }catch(error){
        console.log(error)
    }

}



    return (
        <div>
             
            {user? (
                <>
                <div className="flex flex-col px-10 gap-3">
                    <h1 className="mx-auto text-xl md:text-3xl py-5 ">Edit your profile</h1>
                    
                    <form  onSubmit={handleSubmit} className="md:w-7/8 grid-cols-1 place-content-center py-2 md:py-5 mb-10 rounded-md mx-auto border border-gray-300">
                    {error && <div className="flex justify-center py-2"><p className="text-red-700 text-xs ">{error}</p></div>}
                        <div className="flex flex-row px-10 py-3">
                            
                        <label className="w-1/5 text-md p-2">Email:</label>
                        <input
                        type="email"
                        placeholder={user.email}
                        value={user.email}
                        className="w-4/5 border italic bg-gray-200 text-gray-700 border-solid border-gray-300 rounded px-3 focus:outline-none focus:border-black"
                        name="email" />
                        </div>

                        <div className="flex flex-row px-10 py-3">
                        <label className="w-1/5 text-md p-2">Name:</label>
                        <input
                        type="text"
                        placeholder={user.name}
                        value={user.name}
                        onChange={handleChange}
                        className="w-4/5 border border-solid border-gray-300 rounded px-3 focus:outline-none focus:border-black"
                        name="name" />
                        </div>

                        <div className="flex flex-row px-10 py-3">
                        <label className="w-1/5 text-md p-2">Username:</label>
                        <input
                        type="text"
                        placeholder={user.username}
                        value={user.username}
                        onChange={handleChange}
                        className="w-4/5 border border-solid border-gray-300 rounded px-3 focus:outline-none focus:border-black"
                        name="username" />
                        </div>

                        <div className="flex flex-row px-10 py-3">
                        <label className="w-1/5 text-md p-2">Bio:</label>
                        <textarea onChange={handleChange} className="w-4/5 border border-solid border-gray-300 rounded px-3 focus:outline-none focus:border-black" name="bio" value={user.bio} rows={3} cols={100} />
                        </div>

                        <div className="flex flex-col px-10 py-3">
                            <div className="flex flex-row"> 
                                <label className="w-2/5 text-md p-2">Change profile picture:</label>
                                <input className="text-md w-3/5 p-2 cursor-pointer" onChange={imageChange} type="file" id="img" name="image" accept="image/*"/>
                            </div>
                            <div className="flex flex-row">
                                <div className="w-2/5">   </div>
                                {user.image? <img className=" pt-3 max-w-3/5 " src={user.image }/> : <p>No image</p>}
                            </div>
                           
                        </div>

                        <div className="w-full flex flex-row pt-10 pb-5 justify-center">
                        {/*<button type="submit" className="bg-gray-500 hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" > Save Changes </button>*/}
                        <button className="rounded px-3 py-2 mx-1 border border-gray-400 cursor-pointer bg-black text-white  hover:font-bold ">Save Changes </button>
                        <Link href={`/users/${userId}` } className=" rounded px-3 py-2 border border-gray-400 cursor-pointer bg-black text-white  hover:font-bold ">Back </Link>
                        

                        </div>
                       
                    </form>
                    
                </div>
                </>
            ): (
                <div>
                    <h2>Loading</h2>
                </div>
            )}
            
        </div>
    )
}

export default EditUser;