import { FolderPlus, Heart, List } from "lucide-react"
import { MenuItemProps, SideBarNavMenu } from "./sidebar-nav-menu"

const organizationLinks:MenuItemProps[]=[
    {
        label:'Favourite Jobs',
        icon:Heart,
        href:'/favourites'
    },
    {
        label:'My Listings',
        icon:List,
        href:'/my-jobs'
    },
    {
        label:'Post Job',
        icon:FolderPlus,
        href:'/post-job'
    }
]

export function OrganizationSidebarMenu(){
    return(
        <>
            <SideBarNavMenu items={organizationLinks}/>
        </>
    )
}