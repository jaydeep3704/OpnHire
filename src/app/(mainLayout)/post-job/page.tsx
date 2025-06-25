import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IngestLogo from "@/assets/inngest-locale.png"
import ArcjetLogo from "@/assets/arcjet.jpg"
import Image from "next/image";
import { CreateJobForm } from "@/components/forms/CreateJobForm";
import { prisma } from "@/utils/db";
import { redirect } from "next/navigation";
import { requireUser } from "@/utils/requireUser";

const companies = [
    {
        id: 1,
        name: "Ingest",
        logo: IngestLogo,
    },
    {
        id: 2,
        name: "Arcjet",
        logo: ArcjetLogo,
    },
    {
        id: 3,
        name: "Ingest",
        logo: IngestLogo,
    },
    {
        id: 4,
        name: "Arcjet",
        logo: ArcjetLogo,
    },
    {
        id: 5,
        name: "Ingest",
        logo: IngestLogo,
    },
    {
        id: 6,
        name: "Arcjet",
        logo: ArcjetLogo,
    },
]

const testimonials = [
  {
    quote:
      "We found our ideal candidate within 48 hours of posting. The quality of applicants was exceptional!",
    author: "Sarah Chen",
    company: "TechCorp",
  },
  {
    quote:
      "The platform made hiring remote talent incredibly simple. Highly recommended!",
    author: "Mark Johnson",
    company: "StartupX",
  },
  {
    quote:"We've consistently found high-quality candidates here. It's our go-to platform for all our hiring needs.",
    author: "Emily Rodriguez",
    company: "InnovateNow",
  },
];

const stats = [
  { id:1,value: "10k+", label: "Monthly active job seekers" },
  { id:2, value: "48h", label: "Average time to hire" },
  { id:3,value: "95%", label: "Employer satisfaction rate" },
  { id:4,value: "500+", label: "Companies hiring monthly" },
];


async function getCompany(userId:string) {
    const data=await prisma.company.findUnique({
        where:{
            userId:userId,
        },
        select:{
            name:true,
            location:true,
            about:true,
            logo:true,
            xAccount:true,
            website:true
        }
    })

    if(!data){
       return redirect("/")
    } 
    return data
}

export default async function PostJobPage() {
    const session=await requireUser()
    const data=await getCompany(session.id as string)
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
            <CreateJobForm 
            companyAbout={data.about} 
            companyLocation={data.location} 
            companyLogo={data.logo} 
            companyName={data.name}
            companyXAccount={data.xAccount}
            companyWebsite={data.website}
            />
            

            <div className="col-span-1">
                <Card  >
                    <CardHeader >
                        <CardTitle className="text-xl">Trusted by Industry Leaders</CardTitle>
                        <CardDescription>
                            Join thousands of companies hiring top talent
                        </CardDescription>  
                    </CardHeader>
                     <CardContent className="space-y-6">
                            {/* company logos */}
                            <div className="grid grid-cols-3 gap-4  ">
                                {
                                    companies.map((company) =>
                                    (<div key={company.id}>

                                        <Image src={company.logo} alt={`${company.id}-${company.name}`} width={80} height={80}
                                            className="rounded-lg opacity-75 transition-opacity hover:opacity-100"
                                        />

                                    </div>))
                                }
                            </div>
                            <div className="space-y-4">
                                {
                                    testimonials.map((testemonial,index)=>(
                                        <blockquote key={index} className="border-l-2 border-primary pl-4">
                                            <p className="text-sm text-muted-foreground italic">
                                            &quot;{testemonial.quote}&quot;
                                            </p>
                                            <footer className="mt-2 text-sm font-medium">
                                                -{testemonial.author},{testemonial.company}
                                            </footer>
                                        </blockquote>
                                    ))
                                }
                            </div>
                            <div>
                                {/* we will render stats here */}
                                <div className="grid grid-cols-2 gap-4">
                                    {
                                        stats.map((stat)=>(
                                            <div key={stat.id} className="rounded-lg bg-muted p-4">
                                                <h4 className="text-2xl font-bold">{stat.value}</h4>
                                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </CardContent>
                </Card>

            </div>
        </div>
    )
}