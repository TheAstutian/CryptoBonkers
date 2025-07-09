"use client"

import { userContext } from "@/app/context/contextlibrary"
import { Article } from "@/app/db"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { useRouter } from "next/navigation"
import { useContext, useEffect, FormEvent, useState } from "react"


const API_URL = process.env.NEXT_PUBLIC_WEB_URL as string 
interface PageProps {
    params: {
        postId: string
    };
  }

export default function EditArticle ({ params }: PageProps) {

const useAppContext = useContext(userContext)
const contextValue = useAppContext
const currentUser = contextValue?.currentUser 
const router = useRouter()


const fetchArticle = async () =>{  
    const postIdSlugs =  params.postId;  
    const FETCH_API_URL = `${API_URL}/api/posts/${postIdSlugs}`
    const result = await fetch(FETCH_API_URL, {method: "GET"})
    const newArticle= await result.json()
    setCurrentPost(newArticle.data)
    setPostHtml(newArticle.data.content)
    setImage(newArticle.data.featuredImage.url)
    setId(newArticle.data._id) 
}


const [error, setError] = useState(' ')
const [postHtml, setPostHtml] = useState('')
const [image, setImage] = useState("")
const [id, setId] = useState("")
const [currentPost, setCurrentPost] = useState <Article | null>(null)


useEffect(()=>{

  fetchArticle()
    
}, [])

const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { 
    const { name, value } = event.target; 

    setCurrentPost(prevUser => {
        if(!prevUser){
            console.warn("Not valid")
            return null
        }
            return {
            ...prevUser, [name]: value
        } as Article; 
    }); 
};

const changeCategories = (event: React.ChangeEvent<HTMLSelectElement>) =>{
    const {name, value} = event.target; 

   setCurrentPost(prevUser =>{
        if(!prevUser){
            return null
        } 
        return {
            ...prevUser, 
            categories: {
                ...prevUser.categories,
                [name]:value
            }
        }
    }) 
}

const changeCheckBoxes = (event: React.ChangeEvent<HTMLInputElement>) =>{
    const {name, checked} = event.target; 
 
    setCurrentPost(prevPost =>{
        if(!prevPost) {
            return null
        }
        return {
            ...prevPost, 
            [
                name === "hero" ? "featured_hero" :
                name === "subhero" ? "featured_subhero" :
                name === "article" ? "featured_articles" :
               
                name
            ]: checked
        };
    })
}

const handleEditorChange = (htmlContent: string) => { 
   
    setPostHtml(htmlContent)
    setCurrentPost(prevPost => {
        if (!prevPost) return null;
        return {
            ...prevPost,
            content: htmlContent 
        };
    });
}; 

const featuredImageUpload = async (file: File) =>{
  
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

  const imageChange = async (e: React.ChangeEvent<HTMLInputElement>) =>{
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const newvalue = await featuredImageUpload(file)
        setImage(newvalue)         
        
    }    
    
}


const handleSubmit= async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setError("")
    
   const postIdSlugs= currentPost?.slug 

    try {
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title")
    const primary  = formData.get("primary")
    const secondary  = formData.get("secondary")
    const image_url = image; 
    const hero = formData.get('hero') !==null; 
    const subhero = formData.get('subhero') !==null; 
    const article = formData.get('article') !==null; 
    const summary = formData.get('summary')
    const post = postHtml
    const author = currentUser?.link

    const updated_article = {
        id, title, primary, secondary, image:image_url, hero, subhero, article, summary, post,  author
    }
        const UPDATE_POST_API = `${API_URL}/api/posts/${postIdSlugs}`
        const response = await fetch ( UPDATE_POST_API, {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(updated_article)
        })
          if(!response){
                    //const errorData = await response.json(); 
                    throw new Error( "Failed to update user")
                }
                console.log('got here 3')
                const result = await response.json(); 
                console.log("Update is a success", result)
                router.push(`${API_URL}/posts/${result.url}&${currentUser?.link? currentUser.link :''}`)
             

    }catch(err){
        console.log(err)
    }
} 

    return (
        <>
         {!currentPost? (
            <div className="col-span-2 text-center py-10">Loading article...</div>
        ) :(<>
        <div className="pb-10 mb-10 ">     
           
            <section className="w-full  mt-10 ">
      <form
        className="p-6 max-w-[960px] grid grid-cols-2 gap-3  mx-auto 
        border border-solid bg-white rounded overflow-y-scroll"
        onSubmit={handleSubmit}>

        {error && <div className="text-red-700 col-span-2 text-xs items-center mx-auto pt-5 pb-2">{error}</div>}
        
        <input
          type="text"
          placeholder="Title"
          onChange={handleChange}
          value={currentPost?.title}
          className="w-full h-12 col-span-2 text-2xl border border-solid border-gray-300 rounded p-3 focus:outline-none focus:border-black"
          name="title" />

        <div className="col-span-1 flex flex-row pt-2 px-5">
        <label htmlFor="primary_category" className="text-gray-300 text-sm pr-5">Primary Category:</label>
        <select className='text-black text-sm cursor-pointer focus:outline-none max-w-[100]' id="category" onChange={changeCategories} value={currentPost?.categories.primary} name="primary">
        <option value="News">News</option>
        <option value="Opinions">Opinions</option>
        <option value="Guides">Guides</option>
        </select>

        </div>

        <div className="col-span-1 flex flex-row pt-2 px-5">
        <label htmlFor="secondary_category" className="text-gray-300 text-sm pr-5">Secondary Category:</label>
        <select className='text-black text-sm cursor-pointer focus:outline-none max-w-[100]' onChange={changeCategories} value={currentPost?.categories.secondary} id="category" name="secondary">
        <option value="DeFi">DeFi</option>
        <option value="Coin">Coin</option>
        <option value="Blockchain">Blockchain</option>
        <option value="Wallet">Wallet</option>
        <option value="Trading">Trading</option>
        <option value="DEX">DEX</option>
        <option value="L1">L1</option>
        <option value="L2">L2</option>
        <option value="Stablecoins">Stablecoins</option>
        <option value="Regulations">Regulations</option>
        <option value="Bitcoin">Bitcoin</option>
        <option value="Ethereum">Ethereum</option>
        <option value="Solana">Solana</option>
        <option value="ETF">ETF</option>
        
        </select>

        </div>

        <div className="col-span-2 flex flex-row pt-2 justify-between px-5">
        <p className="basis-4 text-sm">Featured</p>
        <div className="flex flex-row ">
        <p className="text-sm">Hero</p>
            <label className="switcher ml-3">
            <input id="switcherid" type="checkbox" onChange={changeCheckBoxes} checked={currentPost?.featured_hero}  name="hero" />
            <span className="slider round"></span>
            </label>
        </div>
        <div className="flex flex-row ">
        <p className="text-sm ">Subhero</p>
             <label className="switcher ml-3">
            <input id="switcherid" type="checkbox" onChange={changeCheckBoxes}  checked={currentPost?.featured_subhero} name="subhero" value="subhero"/>
            <span className="slider round"></span>
            </label>
        </div>
        <div className="flex flex-row ">
        <p className="text-sm ">Articles</p>
          <label className="switcher ml-3">
            <input id="switcherid" type="checkbox" name="article" onChange={changeCheckBoxes} checked={currentPost?.featured_articles} />
            <span className="slider round"></span>
            </label>
        </div>
        </div>


        <div className="col-span-1 flex flex-row pt-2 sm:pt-5 px-5 gap-2">
        <label htmlFor="category" className=" w-full text-gray-300 text-sm  ">Featured Image:</label>
        <input className="text-sm cursor-pointer" onChange={imageChange}  /*value={currentPost?.featuredImage.url}*/ type="file" id="img" name="img" accept="image/*"/>
        </div>


        <div className="col-span-1 pt-2 sm:pt-5 sm:min-h-[200px] py-3 px-5">
        <img src={image? image: currentPost?.featuredImage.url } className="max-h-[150px] pl-5"/> { /*<label className="w-full text-sm">Title</label>*/}
        </div>

        <div className="col-span-2 px-5" >
           <label className="text-sm flex flex-col">Article summary:
           <textarea value={currentPost?.summary} onChange={handleChange} className="rounded-md text-sm border border-gray-300 mx-20 mt-3 p-2 focus:outline-none focus:border-black" name="summary"  rows={3} cols={100} />
           </label> 
        </div> 

        <div className="col-span-2 px-5">
            <SimpleEditor content={currentPost.content} onChange={handleEditorChange}/>
        </div>
          
        <div className="col-span-2 pt-5 mx-auto">
        
        <button type='submit'  className="w-full border border-solid border-black rounded px-3 py-2 cursor-pointer hover:bg-gray-200 hover:text-white">
          Update Article
        </button>
         </div>
            
      </form>
    </section>
             
        </div>

      </>)}
        </>
    )
}