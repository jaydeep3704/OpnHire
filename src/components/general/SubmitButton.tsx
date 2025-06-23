"use client"
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { HeartIcon, Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GeneralSubmitButtonProps{
    text:string;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    width?:string;
    icon?:ReactNode
}

export function GeneralSubmitButton({text,variant,width,icon}:GeneralSubmitButtonProps){
    const {pending}=useFormStatus()

    return(
        <Button className={width} variant={variant} disabled={pending}>
            {pending ? (
                <>
                 <Loader2 className="size-4 animate-spin"/>
                 <span>Submitting...</span>
                </>
            ) : (
                <>
                 {icon && <div>{icon}</div>} 
                 <span>{text}</span>
                </>
            )}
        </Button>
    )
}

export function SaveJobButton({savedJob}:{savedJob:boolean}){
    const {pending}=useFormStatus()
    return(
        <Button variant="outline" type="submit" disabled={pending}>
             {pending ? (
                <>
                 <Loader2 className="size-4 animate-spin"/>
                 <span>{savedJob ? 'Unsaving...':'Saving...'}</span>
                </>
            ) : (
                <>
                 <HeartIcon className={cn(savedJob? "fill-current text-red-500":"","size-4 transition-colors")}/> 
                 <span>{savedJob ? "Saved" : "Save Job"}</span>
                </>
            )}
        </Button>
    )
}