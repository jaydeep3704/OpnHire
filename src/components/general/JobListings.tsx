import { Card, CardHeader, CardTitle } from "../ui/card";
import { prisma } from "@/utils/db";
import { EmptyState } from "./EmptyState";
import { JobCard } from "./JobCard";
import { MainPagination } from "./MainPagination";

async function getData(page:number=1,pageSize:number=1) {
    const skip=(page-1)*pageSize
    const [data,totalCount]=await Promise.all([
        prisma.jobPost.findMany({
            where: {
                status: "ACTIVE"
            },
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
            where:{
                status:"ACTIVE"
            }
        })
    ])    

        return {jobs:data,totalPages:Math.ceil(totalCount/pageSize)}
   
}



export async function JobListings({currentPage}:{currentPage:number}) {
    const {jobs,totalPages}= await getData(currentPage,2)

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