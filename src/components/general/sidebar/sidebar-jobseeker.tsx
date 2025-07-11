import { Briefcase, FileText, Heart } from "lucide-react"
import { MenuItemProps, SideBarNavMenu } from "./sidebar-nav-menu"

const jobSeekerLinks:MenuItemProps[]=[
    {
        label:'Favourite Jobs',
        icon:Heart,
        href:'/favourites'
    },
    {
        label:'My Applications',
        icon:Briefcase,
        href:'/my-application'
    },
    {
        label:'Resume',
        icon:FileText,
        href:'/resume'
    }
]


export function JobSeekerSidebarMenu(){
    return(
        <>
          <SideBarNavMenu items={jobSeekerLinks}/>
        </>
    )
}