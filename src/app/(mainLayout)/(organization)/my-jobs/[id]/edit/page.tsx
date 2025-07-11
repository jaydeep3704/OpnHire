import { EditJobForm } from "@/components/forms/EditJobForm";
import { prisma } from "@/utils/db"
import { requireUser } from "@/utils/requireUser";
import { notFound } from "next/navigation";

type ParamsType=Promise<{id:string}>

async function getData(jobId:string,userId:string){
    const data=await prisma.jobPost.findUnique({
        where:{
            id:jobId,
            Company:{
                userId:userId
            }
        },
        select:{
            benefits:true,
            id:true,
            jobTitle:true,
            jobDescription:true,
            salaryFrom:true,
            salaryTo:true,
            location:true,
            employmentType:true,
            listingDuration:true,
            Company:{
                select:{
                    about:true,
                    name:true,
                    location:true,
                    website:true,
                    xAccount:true,
                    logo:true
                }
            }
        }
    })
    if(!data) return notFound()
    return data;
}


export default async function EditJobPage({params}:{params:ParamsType}){
    const {id}=await params
    const user=await requireUser()
    const data=await getData(id,user.id)

    return(
        <EditJobForm jobPost={data}/>
    )
}