"use client"

import Link from "next/link";
import {headers, navs} from '../fonts';
import { userContext } from "../context/contextlibrary";
import {Twitter, Facebook, Linkedin, ArrowRightToLineIcon, NotebookPenIcon} from 'lucide-react'
import { useContext } from "react";


export const SiteHeader = ()=>{
    
const useAppContext = useContext(userContext)
const contextValue = useAppContext
const currentUser = contextValue?.currentUser
const logout = contextValue?.logout
 


    return (
        <header className={` p-2 flex flex-col ${headers.className}`}>
            {currentUser&& <div className="absolute top-3 right-3 flex flex-row gap-2"><h1 className="font-bold hover:font-semibold cursor-pointer" ><Link href={`/users/${currentUser.link}`}> {currentUser.username}</Link></h1>  <h1 className="hover:font-bold cursor-pointer"><Link href='/posts/new'> <NotebookPenIcon /></Link></h1> <h1 onClick={logout} className="hover:font-bold cursor-pointer"><ArrowRightToLineIcon /></h1></div>}
        {/* top section of header- social media links | site title | search, login and subscribe button */}
        <div className=" w-full sm:flex sm:flex-col  gap-3 py-3"> 
            <div className="flex flex-row gap-2"> 
            <Link
                rel="apple-touch-icon"
                href="/apple-icon?<generated>">
                <Twitter />
            </Link>

            <Link
                rel="apple-touch-icon"
                href="/apple-icon?<generated>">
                <Facebook />
            </Link>

            <Link
                rel="apple-touch-icon"
                href="/apple-icon?<generated>">
                <Linkedin />
            </Link>
 
            </div>

            <div className="mx-auto "><h1 className={`${headers.className} text-3xl`}><Link href="/">The Crypto Bunkers</Link></h1></div>
            <div className=" hidden gap-2 flex flex-row">
                <input type="search" name="search" id="search" className="bg-gray-50 border border-black text-gray-900 text-sm focus:ring-black block p-2.5" placeholder="Search" />
                <button type='submit' className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-center text-white bg-black rounded-xs focus:ring-4 hover:text-gray-300 hover:bg-stone-800 border border-black cursor-pointer">Sign In</button>
                <button type='submit' className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-center text-white bg-black  focus:ring-4 hover:text-gray-300 hover:bg-stone-800 border border-black cursor-pointer">Subscribe</button>
            </div>
        </div>

        <div> {/* //bottom section of header - navigation */}
        <nav className="w-full my-5 border-y py-2 px-10">
            <ul className={`${navs.className} w-2/3 mx-auto flex flex-row gap-1 justify-around`}>
                <li className="text-xl cursor-pointer"><Link href={"/categories/News"}>News</Link></li>
                <li className="text-xl cursor-pointer"><Link href={"/categories/Opinions"}>Opinions</Link></li>
                <li className="text-xl cursor-pointer"><Link href={"/categories/Guides"}>Learn</Link></li>
            </ul>
        </nav>
        </div>

        </header>
    )
}