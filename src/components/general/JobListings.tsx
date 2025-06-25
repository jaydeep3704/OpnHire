import { prisma } from "@/utils/db";
import { EmptyState } from "./EmptyState";
import { JobCard } from "./JobCard";
import { MainPagination } from "./MainPagination";
import { JobPostStatus } from "@prisma/client";

async function getData( {page=1,pageSize=1,jobTypes=[],location}:{
    page:number,
    pageSize:number,
    jobTypes:string [],
    location:string
}) {
    const skip=(page-1)*pageSize
    const where={
        status:JobPostStatus.ACTIVE,
        ...(jobTypes.length>0 && {
            employmentType:{
                in:jobTypes
            }
        }),
        ...(location && 
            location !=="worldwide" && 
            {
            location:location,
        }) 
    }
    const [data,totalCount]=await Promise.all([
        prisma.jobPost.findMany({
            where:where,
            take:pageSize,
            skip:skip,
            select: {
                jobTitle: true,
                id: true,
                salaryFrom: true,
                salaryTo: true,
                location: true,
                createdAt: true,
                employmentType:true,
                Company: {
                    select: {
                        name: true,
                        logo: true,
                        location: true,
                        about: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prisma.jobPost.count({
            where:where
        })
    ])    

        return {jobs:data,totalPages:Math.ceil(totalCount/pageSize)}
   
}



export async function JobListings({currentPage,jobTypes,location}:{currentPage:number,jobTypes:string[],location:string}) {
    const {jobs,totalPages}= await getData({page:currentPage,pageSize:2,jobTypes,location})

    return (
        <>
            {
                jobs.length > 0 ? 
                (<div className="flex flex-col gap-6">
                        {
                            jobs.map((job) => (
                                <JobCard 
                                job={job} 
                                key={job.id}
                                />
                            ))
                        }
                </div>) 
                :
                (
                <EmptyState 
                buttonText="Clear All Filters" 
                description="Please try searching for a different job or location" 
                href="/" 
                title="No Jobs Found"
                />
                )
            }
            <div className="w-full justify-center mt-6">
                <MainPagination currentPage={currentPage} totalPages={totalPages}/>
            </div>
        </>
    )
}