"use server";

import { redirect } from "next/navigation";
import { requireUser } from "./requireUser";
import { string, z } from "zod"
import { companySchema, jobSchema, jobSeekerSchema } from "./zodSchema";
import { prisma } from "./db";
import arcjet, { detectBot, shield } from "./arcjet";
import { request } from "@arcjet/next";


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

    const validateData = companySchema.parse(data);
    await prisma.user.update({
        where: {
            id: session.id
        },
        data: {
            onboardingCompleted: true,
            userType: "COMPANY",
            company: {
                create: {
                    about: validateData.about,
                    location: validateData.location,
                    logo: validateData.logo,
                    name: validateData.name,
                    website: validateData.website,
                    xAccount: validateData.xAccount ?? null
                }
            }
        }
    });

    return redirect("/")
}


export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
    const user = await requireUser()
    const validateData = jobSeekerSchema.parse(data);
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
                    name: validateData.name,
                    about: validateData.about,
                    resume: validateData.resume
                }
            }
        }
    })
    return redirect("/")
}


export async function createJob(data: z.infer<typeof jobSchema>) {
    const user = await requireUser()
    const validateData = jobSchema.parse(data);
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
            id:true
        }
    })
    
    if(!company?.id){
        return redirect("/")
    }


    await prisma.jobPost.create({
        data:{
            jobTitle:validateData.jobTitle,
            jobDescription:validateData.jobDescription,
            employmentType:validateData.employmentType,
            location:validateData.location,
            salaryFrom:validateData.salaryFrom,
            salaryTo:validateData.salaryTo,
            listingDuration:validateData.listingDuration,
            benefits:validateData.benefits,
            companyId:company.id,
        }
    })
    
    return redirect("/")

}