import { UploadResumeForm } from "@/components/forms/UploadResumeForm"
import { GeneralSubmitButton } from "@/components/general/SubmitButton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createApplication } from "@/utils/actions"
import { getCurrentUser } from "@/utils/currentUser"
import { prisma } from "@/utils/db"
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { FileText } from "lucide-react"
import { redirect } from "next/navigation"

async function getJobSeekerInfo(userId: string, userType: string) {

    if (userType !== 'JOB_SEEKER') {
        redirect('/')
    }
    try {
        const jobSeeker = await prisma.jobSeeker.findUnique({
            where: {
                userId: userId
            }
        })

        return jobSeeker
    } catch (error) {
        throw new Error('Not able to get job seeker info')
    }
}


export default async function ApplyPage({params}:{params:Promise<{jobId?:string}>}) {
    const {jobId}=await params
    const user = await getCurrentUser()
    const jobSeeker = await getJobSeekerInfo(user.id, user.userType)
    

    return (
        <div className="grid grid-cols-1 gap-6">
            <Card className="p-6">
                {jobSeeker && <UploadResumeForm resume={jobSeeker.resume} />}
            </Card>
            <Card className="p-6">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-fit" variant="default">Click To Apply <FileText /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. Your application cant be reverted back once applied
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <form action={async ()=>{
                                "use server"
                                 const {success,message}=await createApplication(jobId)
                                 if(success){
                                    redirect('/my-applications')
                                 }
                                 else{
                                    console.log("Failed to create job application")
                                 }
                            }}>
                                <AlertDialogAction  asChild>
                                    <GeneralSubmitButton text="Continue" />
                                </AlertDialogAction>
                            </form>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Card>
        </div>
    )
}