"use client"

import { userContext } from "@/app/context/contextlibrary"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { useRouter } from "next/navigation"
import { useContext, useEffect, FormEvent, useState } from "react"

export default function NewArticle () {

const useAppContext = useContext(userContext)
const contextValue = useAppContext
const currentUser = contextValue?.currentUser
const router = useRouter()
const NEW_POST_ENDPOINT = `/api/posts/write`;

const [error, setError] = useState(' ')
const [postHtml, setPostHtml] = useState('')
const [image, setImage] = useState("")

useEffect(()=>{
    if (!currentUser){
        router.push('/')
    }
    
})

const onChange= (content: string)=>{
    setPostHtml(content);
    
  }
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
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title")
    const primary_category = formData.get("primary_category")
    const secondary_category = formData.get("secondary_category")
    const image = formData.get('img')
    if (!image || !(image instanceof File) || image.size === 0) {
        setError('Please select a valid image to upload.');
        return; 
    }

    const image_url = await featuredImageUpload(image)
    const hero = formData.get('hero') !==null; 
    const subhero = formData.get('subhero') !==null; 
    const article = formData.get('article') !==null; 
    const summary = formData.get('summary')
    const post = postHtml
    const author = currentUser?.link

    const new_article = {
        title, primary_category, secondary_category, image:image_url, hero, subhero, article, summary, post, author
    }

const response = await fetch (NEW_POST_ENDPOINT, {
    method: "POST", 
    headers: {
        'Content-Type': 'application/json', 
    }, 
    body: JSON.stringify({new_article}) 
})

const result = await response.json()


  alert('New post created')
  router.push(`/posts/${result.data.slug}&${currentUser?.link}`)
 } 

    return (
        <>
        <div className="pb-10 mb-10 ">     
           
            <section className="w-full  mt-10 ">
      <form
        className="p-6 max-w-[960px] grid grid-cols-2 gap-3  mx-auto 
        border border-solid bg-white rounded overflow-y-scroll"
        onSubmit={handleSubmit}>

        {error && <div className="text-red-700 col-span-2 text-xs items-center mx-auto pt-5 pb-2">{error}</div>}
        
        <input
          type="title"
          placeholder="Title"
          className="w-full h-12 col-span-2 text-2xl border border-solid border-gray-300 rounded p-3 focus:outline-none focus:border-black"
          name="title" />

        <div className="col-span-1 flex flex-row pt-2 px-5">
        <label htmlFor="primary_category" className="text-gray-300 text-sm pr-5">Primary Category:</label>
        <select className='text-black text-sm cursor-pointer focus:outline-none max-w-[100]' id="category" name="primary_category">
        <option value="News">News</option>
        <option value="Opinions">Opinions</option>
        <option value="Guides">Guides</option>
        </select>

        </div>

        <div className="col-span-1 flex flex-row pt-2 px-5">
        <label htmlFor="secondary_category" className="text-gray-300 text-sm pr-5">Secondary Category:</label>
        <select className='text-black text-sm cursor-pointer focus:outline-none max-w-[100]' id="category" name="secondary_category">
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
            <input id="switcherid" type="checkbox" name="hero" value="hero"/>
            <span className="slider round"></span>
            </label>
        </div>
        <div className="flex flex-row ">
        <p className="text-sm ">Subhero</p>
             <label className="switcher ml-3">
            <input id="switcherid" type="checkbox" name="subhero" value="subhero"/>
            <span className="slider round"></span>
            </label>
        </div>
        <div className="flex flex-row ">
        <p className="text-sm ">Articles</p>
          <label className="switcher ml-3">
            <input id="switcherid" type="checkbox" name="article" value="article"/>
            <span className="slider round"></span>
            </label>
        </div>
        </div>


        <div className="col-span-1 flex flex-row pt-2 sm:pt-5 px-5 gap-2">
        <label htmlFor="category" className=" w-full text-gray-300 text-sm  ">Featured Image:</label>
        <input className="text-sm cursor-pointer" onChange={imageChange} type="file" id="img" name="img" accept="image/*"/>
        </div>


        <div className="col-span-1 pt-2 sm:pt-5 sm:min-h-[200px] py-3 px-5">
        {image? <img src={image} className="max-h-[150px] pl-5"/> : "" /*<label className="w-full text-sm">Title</label>*/}
        </div>

        <div className="col-span-2 px-5" >
           <label className="text-sm flex flex-col">Article summary:
           <textarea className="rounded-md text-sm border border-gray-300 mx-20 mt-3 p-2 focus:outline-none focus:border-black" name="summary"  rows={3} cols={100} />
           </label> 
        </div> 

        <div className="col-span-2 px-5">
            <SimpleEditor content={postHtml} onChange={onChange}/>
        </div>
          
         <div className="col-span-2 pt-5 mx-auto">
        
        <button className="w-full border border-solid border-black rounded px-3 py-2 cursor-pointer hover:bg-gray-200 hover:text-white">
          Submit Article
        </button>
         </div>

      </form>
    </section>
             
        </div>
        </>
    )
}