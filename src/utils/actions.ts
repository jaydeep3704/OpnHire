"use server";

import { redirect } from "next/navigation";
import { requireUser } from "./requireUser";
import {  z } from "zod"
import { companySchema, jobSchema, jobSeekerSchema } from "./zodSchema";
import { prisma } from "./db";
import arcjet, { detectBot, shield } from "./arcjet";
import { request } from "@arcjet/next";
import { stripe } from "./stripe";
import { jobListingDurationPricing } from "./jobListingDurationSelector";
import { inngest } from "./inngest/client";
import { revalidatePath } from "next/cache";


const aj = arcjet.withRule(
    shield({
        mode: 'LIVE'
    })
).withRule(
    detectBot(
        {
            mode: "LIVE",
            allow: []
        }
    )
)

export async function createCompany(data: z.infer<typeof companySchema>) {
    const session = await requireUser()
    const req = await request()
    const decision = await aj.protect(req)
    if (decision.isDenied()) {
        throw new Error("Forbidden")
    }

    const validatedData = companySchema.parse(data);
    await prisma.user.update({
        where: {
            id: session.id
        },
        data: {
            onboardingCompleted: true,
            userType: "COMPANY",
            company: {
                create: {
                    about: validatedData.about,
                    location: validatedData.location,
                    logo: validatedData.logo,
                    name: validatedData.name,
                    website: validatedData.website,
                    xAccount: validatedData.xAccount ?? null
                }
            }
        }
    });

    return redirect("/")
}


export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
    const user = await requireUser()
    const validatedData = jobSeekerSchema.parse(data);
    const req = await request()
    const decision = await aj.protect(req)
    if (decision.isDenied()) {
        throw new Error("Forbidden")
    }
    
    const jobSeeker=await prisma.user.update({
        where: {
            id: user.id as string
        },
        data: {
            onboardingCompleted: true,
            userType: "JOB_SEEKER",
            jobSeeker: {
                create: {
                    name: validatedData.name,
                    about: validatedData.about,
                    resume: validatedData.resume
                }
            }
        }
    })

    await inngest.send({
        name:"jobseeker/created",
        data:{
            userId:user.id,
            email:user.email
        }
    })
    return redirect("/")
}


export async function createJob(data: z.infer<typeof jobSchema>) {
    const user = await requireUser()
    const validatedData = jobSchema.parse(data);
    const req = await request()
    const decision = await aj.protect(req)
    if (decision.isDenied()) {
        throw new Error("Forbidden")
    }
    const company=await prisma.company.findUnique({
        where:{
            userId:user.id
        },
        select:{
            id:true,
            user:{
                select:{
                    stripeCustomerId:true
                }
            }
            
        }
    })


    
    if(!company?.id){
        return redirect("/")
    }

    let stripeCustomerId=company.user.stripeCustomerId
    if(!stripeCustomerId){
        const customer=await stripe.customers.create({
            email:user.email,
            name:user.name
        })
        stripeCustomerId=customer.id
        //update use with customer id
        await prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                stripeCustomerId:stripeCustomerId
            }
        })
    }

   const job= await prisma.jobPost.create({
        data:{
            jobTitle:validatedData.jobTitle,
            jobDescription:validatedData.jobDescription,
            employmentType:validatedData.employmentType,
            location:validatedData.location,
            salaryFrom:validatedData.salaryFrom,
            salaryTo:validatedData.salaryTo,
            listingDuration:validatedData.listingDuration,
            benefits:validatedData.benefits,
            companyId:company.id,
        },
        select:{
            id:true
        }
    })

    const pricingTier=jobListingDurationPricing.find((tier)=>tier.days===validatedData.listingDuration)
    if(!pricingTier){
        throw new Error("Invalid Listing Duration")
    }    
    await inngest.send({
        name:'job/created',
        data:{
            jobId:job.id,
            expirationDays:validatedData.listingDuration
        }
    })

    const session=await stripe.checkout.sessions.create({
        customer:stripeCustomerId,
        line_items:[
            {
                price_data:{
                    product_data:{
                        name:`Job Posting - ${pricingTier.days} Days`,
                        description:pricingTier.description,
                        images:[
                            "https://7kf49zim2e.ufs.sh/f/AZ2bzpFK1goDc2sAPVWBTgM8XE74obUVJK6ZepvudwasqDt0"
                        ]
                    },
                    currency:'USD',
                    unit_amount:pricingTier.price*100,
                },
                quantity:1,
            }
        ],
        metadata:{
            jobId:job.id
        },
        mode:'payment',
        success_url:`${process.env.NEXT_PUBLIC_URL}/payment/success`,
        cancel_url:`${process.env.NEXT_PUBLIC_URL}/payment/cancel`
    })

    return redirect(session.url as string)
}


export async function saveJobPost(jobId:string){
    const user=await requireUser();
    const req=await request();
    const decision=await aj.protect(req)
    if(decision.isDenied()){
        throw new Error("Forbidden")
    }
    
    await prisma.savedJobPost.create({
        data:{
            jobPostId:jobId,
            userId:user.id
        }
    })
    
    revalidatePath(`/job/${jobId}`)
}

export async function unSaveJobPost(savedJobPostId:string){
    const user=await requireUser();
    const req=await request();
    const decision=await aj.protect(req)
    if(decision.isDenied()){
        throw new Error("Forbidden")
    }
    
    const data=await prisma.savedJobPost.delete({
        where:{
            id:savedJobPostId,
            userId:user.id
        },
        select:{
            jobPostId:true
        }
    })
    
     revalidatePath(`/job/${data.jobPostId}`)}


export async function editJobPost(data:z.infer<typeof jobSchema>,jobId:string){
    const user=await requireUser()
    const req=await request()
    const decision=await aj.protect(req)
    if(decision.isDenied()){
        throw new Error("Forbidden")
    }

    const validateData=jobSchema.parse(data)
    await prisma.jobPost.update({
        where:{
            id:jobId,
            Company:{
                userId:user.id
            }
        },
        data:{
            jobDescription:validateData.jobDescription,
            jobTitle:validateData.jobTitle,
            employmentType:validateData.employmentType,
            location:validateData.location,
            salaryFrom:validateData.salaryFrom,
            salaryTo:validateData.salaryTo,
            listingDuration:validateData.listingDuration,
            benefits:validateData.benefits,
            Company:{
                update:{
                    location:validateData.companyLocation
                }
            }
        }
    })

    return redirect("/my-jobs")
}


export async function deleteJobPost(jobId:string){
    const user=await requireUser()
    const req=await request()
    const decision=await aj.protect(req)
    if(decision.isDenied()){
        throw new Error("Forbidden")
    }
    await prisma.jobPost.delete({
        where:{
            id:jobId,
            Company:{
                userId:user.id
            }
        }
    })
    
    await inngest.send({
        name:'job/cancel.expiration',
        data:{
            jobId:jobId
        }
    })

    return redirect("/my-jobs")
}