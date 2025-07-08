"use client"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { useState } from "react"


export default function Page() {
  const [post, setPost] = useState('')
  const onChange= (content: string)=>{
    setPost(content);
    console.log(content)
  }

  return <SimpleEditor content={post}  onChange={onChange} />
}
