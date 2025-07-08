"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
//import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userContext } from "@/app/context/contextlibrary";



export default function SignInPage () {

    const [error, setError] = useState("")
    const router= useRouter()
    const useAppContext = useContext(userContext)
    const contextValue = useAppContext
    const login = contextValue?.login

    
useEffect(()=>{
    const checkUser = localStorage.getItem('user')
    
 if (checkUser ){
    console.log('User already logged in, redirecting...')
    router.push('/')
 }  

}, [router]) 


const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")
    const password = formData.get("password")    
    const data = {email, password}

    if(!email || !password){
        setError("Email and password are required")
        return
    }
    
    if (login!=undefined){
       
       try{
        const resultFromServer = await login({email: String(email), password: String(password)});
        console.log('result from server', resultFromServer)
        if(resultFromServer&& resultFromServer.data){
           router.push('/') 
        } else {
            setError(resultFromServer?.message || "An unknown error occurred")
        }
       } catch(error:unknown){
        if(error instanceof Error){
            setError(error.message)
        } else if (typeof error === 'string'){
            setError(error)
        }
       }
        
       
    }


/*    const response = await fetch (apilink, {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json', 
        }, 
        body: JSON.stringify(data) 
    })
*
    const result = await response.json()

    if(!result.data){
        setError(result?.message)
    } else if (result.data){
    localStorage.setItem("user", JSON.stringify(result.data))
    router.push('/')
    } else {
        setError("An error occurred")
    }    */  
};


    return (
        <>
       <section className="w-full h-screen flex items-center justify-center">
        <form
            className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2 
            border border-solid border-black bg-white rounded"
            onSubmit={handleSubmit}>

            {error && <div className="text-red-700 text-xs">{error}</div>}
            <h1 className="mb-5 w-full text-2xl font-bold">Sign In</h1>
            <label className="w-full text-sm">Email</label>
            <input
            type="email"
            placeholder="Email"
            className="w-full h-8 border border-solid border-black rounded p-2"
            name="email" />
            <label className="w-full text-sm">Password</label>
            <div className="flex w-full">
            <input
                type="password"
                placeholder="Password"
                className="w-full h-8 border border-solid border-black rounded p-2"
                name="password" />
            </div>
            <button className="w-full border border-solid border-black rounded cursor-pointer ">
            Sign In
            </button>
            {/*
            <Link
            href="/register"
            className="text-sm text-[#888] transition duration-150 ease hover:text-black">
            Don't have an account?
            </Link>*/}

        </form>
    </section>
        </>
    )
}