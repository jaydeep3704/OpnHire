"use server";

import { redirect } from "next/navigation";
import { requireUser } from "./requireUser";
import { string, z } from "zod"
import { companySchema, jobSchema, jobSeekerSchema } from "./zodSchema";
import { prisma } from "./db";
import arcjet, { detectBot, shield } from "./arcjet";
import { request } from "@arcjet/next";
import { stripe } from "./stripe";
import { jobListingDurationPricing } from "./jobListingDurationSelector";


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
    await prisma.user.update({
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


