"use client"
import { Link2 } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { toast } from "sonner";
export  function CopyLinkMenuItem ({jobURL}:{jobURL:string}){

  async function handleCopy(){
    try {
        await navigator.clipboard.writeText(jobURL)
        toast.success("URL copied to clipboard!")
    } catch (error) {
        console.log(error)
        toast.error("Failed to copy URL")
    }
  }  

  return (
    <DropdownMenuItem onClick={handleCopy}>
        <Link2 className="size-4"/>
        <span>Copy Job URL</span>
    </DropdownMenuItem>
  )
}

