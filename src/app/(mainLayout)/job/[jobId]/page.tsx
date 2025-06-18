import { JsonToHTML } from "@/components/general/JsonToHTML";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { benefits } from "@/utils/benefitsList";
import { prisma } from "@/utils/db";
import { Heart } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import arcjet, { detectBot,fixedWindow } from "@/utils/arcjet";
import { request } from "@arcjet/next";


const aj=arcjet.withRule(detectBot({
    mode:"LIVE",
    allow:["CATEGORY:SEARCH_ENGINE","CATEGORY:PREVIEW"]
})).withRule(fixedWindow({
    mode:"LIVE",
    window:"60s",
    max:10
}))

async function getJob(jobId: string) {
  const jobData = await prisma.jobPost.findUnique({
    where: {
      status: "ACTIVE",
      id: jobId,
    },
    select: {
      jobTitle: true,
      jobDescription: true,
      employmentType: true,
      benefits: true,
      location: true,
      salaryFrom: true,
      salaryTo: true,
      createdAt: true,
      updatedAt: true,
      listingDuration:true,
      Company: {
        select: {
          name: true,
          logo: true,
          location: true,
          about: true,
        },
      },
    },
  });

  if (!jobData) {
    return notFound();
  }
  return jobData;
}

type Params = Promise<{ jobId: string }>;

export default async function JobPage({ params }: { params: Params }) {
  const { jobId } = await params;
  const req=await request()
  
  const decision=await aj.protect(req)

  if(decision.isDenied()){
    throw new Error("Forbidden")
  }
  const data = await getJob(jobId);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left column */}
      <div className="space-y-8 col-span-2 ">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-3xl">{data.jobTitle}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <p className="font-medium">{data.Company.name}</p>
              <span className="hidden md:inline text-muted-foreground">*</span>
              <Badge className="rounded-full" variant="secondary">
                {data.employmentType}
              </Badge>
              <span className="hidden md:inline text-muted-foreground">*</span>
              <Badge className="rounded-full">{data.location}</Badge>
            </div>
          </div>
          <Button variant="outline">
            <Heart className="size-4" />
            Save Job
          </Button>
        </div>


        {/* Description */}
        <section>
          <JsonToHTML json={JSON.parse(data.jobDescription)} />
        </section>

        {/* Benefits */}
        <section>
          <h3 className="font-semibold mb-4">
            Benefits
            <span className="text-sm text-muted-foreground font-normal">
              {" "}
              (green is offered)
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit) => {
              const isOffered = data.benefits.includes(benefit.id);
              return (
                <Badge
                  key={benefit.id}
                  className={cn(
                    isOffered ? "" : "opacity-75 cursor-not-allowed",
                    "transition-all hover:scale-105 py-1.5 px-4 rounded-full"
                  )}
                  variant={isOffered ? "default" : "outline"}
                >
                  <span className="flex gap-2 items-center">
                    {benefit.icon}
                    {benefit.label}
                  </span>
                </Badge>
              );
            })}
          </div>
        </section>
      </div>

      {/* Right column */}
      <div className="space-y-6 col-span-1">
        <Card className="p-6">
          <div className="space-y-4 ">
            <div>
                <h3 className="font-semibold">Apply Now</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Please let {data.Company.name} know that you found this job on OpnHire.
                    This helps us grow!
                </p>
            </div>
            <Button className="w-full">Apply Now</Button>
          </div>
        </Card>

        <Card className="p-6">
            <h3 className="font-semibold">About the job</h3>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Apply Before</span>
                    <span className="text-sm">{
                    new Date(data.createdAt.getTime() 
                    + data.listingDuration*1000*60*60*24)
                    .toLocaleDateString('en-US',{
                        month:'long',
                        day:'numeric',
                        year:'numeric'
                    })}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Posted on</span>
                    <span className="text-sm ">{data.createdAt.toLocaleDateString('en-US',{
                        month:'long',
                        day:'numeric',
                        year:'numeric'
                    })}</span>
                </div>
            </div>
            <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">Employment Type</span>
                        <span className="text-sm">{data.employmentType}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">Location</span>
                        <span className="text-sm">{data.location}</span>
                    </div>
            </div>
        </Card>

        {/* company card */}
        <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex  gap-3">
                        <Image src={data.Company.logo} alt="company_logo" height={48} width={48} className="rounded-full size-12"/>
                        <div className="flex flex-col">
                            <h3 className="font-semibold">{data.Company.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">{data.Company.about}</p>
                        </div>
                    </div>
                </div>    
        </Card>

      </div>
    </div>
  );
}
