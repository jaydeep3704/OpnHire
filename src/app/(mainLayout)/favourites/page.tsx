import { EmptyState } from "@/components/general/EmptyState"
import { JobCard } from "@/components/general/JobCard"
import { prisma } from "@/utils/db"
import { requireUser } from "@/utils/requireUser"
async function getFavourites(userId:string){
    const favouriteJobs=await prisma.savedJobPost.findMany({
        where:{
            userId:userId
        },
        select:{
            JobPost:{
                select:{
                    id:true,
                    jobTitle:true,
                    salaryFrom:true,
                    salaryTo:true,
                    location:true,
                    createdAt:true,
                    employmentType:true,
                    Company:{
                        select:{
                            name:true,
                            location:true,
                            logo:true,
                            about:true
                        }
                    }
                }
            }
        }
    })

    return favouriteJobs
}


export default async function FavouritesPage(){

    const user=await requireUser()
    const data=await getFavourites(user.id)

    {
        if(data.length===0){
            return <EmptyState title="No Favourites found" description="You don't have any favourites yet" buttonText="Find a job" href="/"/>
        }
        return(
            <div className="grid grid-cols-1 mt-5 gap-4">
                {
                    data.map((favourite)=>(
                        <JobCard job={favourite.JobPost} key={favourite.JobPost.id}/>
                    ))
                }
            </div>
        )
    }
}