import { Card, CardHeader, CardTitle } from "../ui/card";
import { prisma } from "@/utils/db";
import { EmptyState } from "./EmptyState";
import { JobCard } from "./JobCard";

async function getData() {
    try {
        const data = await prisma.jobPost.findMany({
            where: {
                status: "ACTIVE"
            },
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
        })
        return data
    } catch (error) {
        throw new Error("Failed to fetch job Listing Data")
    }
}



export async function JobListings() {
    const data = await getData()

    return (
        <>
            {
                data.length > 0 ? 
                (<div className="flex flex-col gap-6">
                        {
                            data.map((job) => (
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
        </>
    )
}