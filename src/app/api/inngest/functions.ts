import { prisma } from "@/utils/db";
import { inngest } from "../../../utils/inngest/client";

export const handleJobExpiration=inngest.createFunction(
    {id:"expire-job"},
    {event:'job/created'},
    async({event,step})=>{
        const{jobId,expirationDays}=event.data
        await step.sleep("wait-for-expiration",`${expirationDays}d`)
        await step.run("update-job-status",async ()=>{
            await prisma.jobPost.update({
                where:{
                    id:jobId
                },
                data:{
                    status:"EXPIRED"
                }
            })
        })
        return {jobId,message:"Job marked as expired"}
    }
)