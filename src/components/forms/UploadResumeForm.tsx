"use client"
import { UploadDropzone, UploadButton } from "@/components/general/UploadThingReexported"
import { uploadResume } from "@/utils/actions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Suspense, useState } from "react"
import { buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"





export  function UploadResumeForm({resume}:{resume:string}) {
    const [resumeUrl,setResumeUrl]=useState<string>(resume)
    const router=useRouter()
    return (
        <div >
            <UploadDropzone
                endpoint="resumeUploader"
                onClientUploadComplete={(res) => {
                    console.log(res[0].url)
                    setResumeUrl(res[0].url)
                    uploadResume(res[0].url,res[0].key)
                    router.refresh()
                }}
                onUploadError={() => console.log("Something went wrong")}
                className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary
                ut-uploading:ut-button:bg-primary/80 "
            />
            
            <Link 
            href={resume}  
            target="_blank" 
            className={cn(buttonVariants({variant:'default'}),"mt-4" )}
            rel="noopener noreferer"
            >View Resume</Link>
            
            <div>
                {/* Ai Summary */}
            </div>

        </div>
    )
}