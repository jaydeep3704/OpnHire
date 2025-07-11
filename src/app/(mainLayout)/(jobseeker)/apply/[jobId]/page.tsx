import { UploadResumeForm } from "@/components/forms/UploadResumeForm"
import { Card } from "@/components/ui/card"
import { getCurrentUser } from "@/utils/currentUser"
import { prisma } from "@/utils/db"
import { redirect } from "next/navigation"

async function getJobSeekerInfo(userId:string,userType:string){
    
    if(userType!=='JOB_SEEKER'){
        redirect('/')
    }
    try {
       const jobSeeker= await prisma.jobSeeker.findUnique({
            where:{
                userId:userId
            }
        })
        
        return jobSeeker
    } catch (error) {
        throw new Error('Not able to get job seeker info')
    }
}


export default async function ApplyPage(){
    const user=await getCurrentUser({redirectOnFail:false})
    const jobSeeker=await getJobSeekerInfo(user.id,user.userType)
    
    return(
        <Card className="p-6">
            {jobSeeker && <UploadResumeForm resume={jobSeeker.resume}/>}
        </Card>
    )
}