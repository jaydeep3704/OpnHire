import { UploadResumeForm } from "@/components/forms/UploadResumeForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/utils/currentUser"
import { prisma } from "@/utils/db"
import { ZapIcon } from "lucide-react"
import { redirect } from "next/navigation"
import ReactMarkdown from "react-markdown"
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


export default async function ReumsePage(){
    const user=await getCurrentUser()
    const jobSeeker=await getJobSeekerInfo(user.id,user.userType)
    
    return(
       <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
            {jobSeeker && <UploadResumeForm resume={jobSeeker.resume}/>}
        </Card>
        <Card >
            <CardHeader>
                <CardTitle className="text-xl font-semibold ml-6 flex gap-2 items-center"><ZapIcon className="size-5"/>Resume AI Summary</CardTitle>
                <CardContent className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>
                    {
                        jobSeeker.resumeAiSummary
                    }
                    </ReactMarkdown>
                </CardContent>
            </CardHeader>
        </Card>
       </div> 
    )
}