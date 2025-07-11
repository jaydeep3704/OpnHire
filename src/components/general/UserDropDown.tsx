
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup,DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { auth, signOut } from "@/utils/auth";
import { Button } from "../ui/button";
import { ChevronDown, Heart, Layers2, LogOut } from "lucide-react";

import Link from "next/link";
import { getCurrentUser } from "@/utils/currentUser";
export default async function UserDropDown(){
    
    const user=await getCurrentUser()
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild >
                <Button variant="ghost" className="!p-0 !h-auto hover:!bg-transparent cursor-pointer !border-none">
                <Avatar >
                    <AvatarImage src={user.image} alt="profile-image" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <ChevronDown size={16} strokeWidth={2} className="ml-2 opacity-60"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" mt-3" align="end">
                <DropdownMenuLabel className="flex flex-col ">
                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                         <Link href={"/favourites"} >
                             <Heart size={16} strokeWidth={2} className="opacity-60"/>
                             <span>
                             Favourite Jobs
                             </span>
                         </Link>
                    </DropdownMenuItem>
                   {user.userType!=="JOB_SEEKER" && <DropdownMenuItem asChild>
                         <Link href={"/my-jobs"} >
                             <Layers2 size={16} strokeWidth={2} className="opacity-60"/>
                             <span>
                              My Job Listings
                             </span>
                         </Link>
                    </DropdownMenuItem>}
                    
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                 <DropdownMenuItem asChild>
                     <form action={
                        async ()=>{
                            "use server"
                            await signOut({
                                redirectTo:"/"
                            })
                        }
                     }>
                        <button className="flex items-center gap-2 w-full">
                            <LogOut size={16} strokeWidth={2} className="opacity-60"/>
                            <span>Logout</span>
                        </button>
                     </form>
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}