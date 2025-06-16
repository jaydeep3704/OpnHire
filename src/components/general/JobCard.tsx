import Link from "next/link";
import { Card, CardHeader } from "../ui/card";
import { MapIcon, MapPin, User2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
interface jobCardProps{
 job:{
    jobTitle: string;
    id: string;
    createdAt: Date;
    employmentType:string;
    Company: {
        about: string;
        name: string;
        location: string;
        logo: string;
    };
    location: string;
    salaryFrom: number;
    salaryTo: number;
  }
}



export function JobCard({job}:jobCardProps){
    return(
        <Link href={`job/${job.id}`}>
            <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary">
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                        <Image src={job.Company.logo} alt={job.Company.name} width={48} height={48} className="size-12 rounded-lg"/>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold">{job.jobTitle}</h1>
                            <div className="flex flex-wrap gap-2 items-center">
                                <p className="text-sm text-muted-foreground">{job.Company.name}</p>
                                <span className="hidden md:inline text-muted-foreground">*</span>
                                <Badge className="rounded-full" variant="secondary">
                                    {job.employmentType}
                                </Badge>
                                <span className="hidden md:inline text-muted-foreground">*</span>
                                <Badge className="rounded-full">
                                    {job.location}
                                </Badge>
                                <span className="hidden md:inline text-muted-foreground">*</span>
                                <p className="text-sm text-muted-foreground">{formatCurrency(job.salaryFrom)} -{" "}{formatCurrency(job.salaryTo)}</p>
                            </div>
                        </div>
                        <div className="md:ml-auto justify-end">
                            <div className="flex gap-2 items-center">
                                <MapPin className="size-4"/>
                                <h1>{job.location}</h1>
                            </div>
                            <p className="text-sm text-muted-foreground md:text-right">{formatRelativeTime(job.createdAt)}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-base text-muted-foreground line-clamp-2 !mt-5">{job.Company.about}</p>
                    </div>
                </CardHeader>
            </Card>
        </Link>
    )
}