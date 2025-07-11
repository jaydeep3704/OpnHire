import { JsonToHTML } from "@/components/general/JsonToHTML";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { benefits } from "@/utils/benefitsList";
import { prisma } from "@/utils/db";
import { Heart } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import arcjet, { detectBot, tokenBucket } from "@/utils/arcjet";
import { request } from "@arcjet/next";
import { auth } from "@/utils/auth";
import Link from "next/link";
import { SaveJobButton } from "@/components/general/SubmitButton";
import { saveJobPost, unSaveJobPost } from "@/utils/actions";
import { getCurrentUser } from "@/utils/currentUser";


const aj = arcjet.withRule(detectBot({
  mode: "LIVE",
  allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"]
}))

function getClient(session: boolean) {
  if (session) {
    return aj.withRule(
      tokenBucket({
        capacity: 100,
        interval: "60s",
        refillRate: 30,
        mode: "LIVE"
      })
    )
  }
  else {
    return aj.withRule(
      tokenBucket({
        capacity: 100,
        interval: "60s",
        refillRate: 10,
        mode: "LIVE"
      })
    )
  }

}


async function getJob(jobId: string,userId?:string) {
  

  const [jobData,savedJob]=await Promise.all([
    await prisma.jobPost.findUnique({
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
      listingDuration: true,
      Company: {
        select: {
          name: true,
          logo: true,
          location: true,
          about: true,
        },
      },
    },
  }),
  userId ?
  await prisma.savedJobPost.findUnique({
    where:{
      userId_jobPostId:{
        userId:userId,
        jobPostId:jobId
      }
    },
    select:{
      id:true
    }
  }):null
  ])

  if (!jobData) {
    return notFound();
  }
  return {
    jobData,savedJob
  }
}

type Params = Promise<{ jobId: string }>;

export default async function JobPage({ params }: { params: Params }) {
  const { jobId } = await params;
  const req = await request()
  const session = await auth()
  const user=await getCurrentUser()
  const decision = await getClient(!!session).protect(req, { requested: 10 })

  if (decision.isDenied()) {
    throw new Error("Forbidden")
  }
  const {jobData:data,savedJob} = await getJob(jobId,session?.user?.id);

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
          {
            session?.user ? (
              <form action={
                savedJob? unSaveJobPost.bind(null,savedJob.id) : saveJobPost.bind(null,jobId)
              }>
                <SaveJobButton savedJob={!!savedJob} />
              </form>
            ) :
              (<Link href={"/login"} className={buttonVariants({ variant: "outline" })}>
                <Heart className="size-4" />
                Save Job
              </Link>)
          }

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
            
           {user.userType==="JOB_SEEKER" && <Link  href={`/apply/${jobId}`}  className={cn(buttonVariants({variant:'default'}),'w-full')}>Apply Now</Link>}
            
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold">About the job</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Apply Before</span>
              <span className="text-sm">{
                new Date(data.createdAt.getTime()
                  + data.listingDuration * 1000 * 60 * 60 * 24)
                  .toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Posted on</span>
              <span className="text-sm ">{data.createdAt.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
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
              <Image src={data.Company.logo} alt="company_logo" height={48} width={48} className="rounded-full size-12" />
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
