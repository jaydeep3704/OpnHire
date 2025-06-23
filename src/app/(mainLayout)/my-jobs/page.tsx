import { CopyLinkMenuItem } from "@/components/general/CopyLinkMenuItem";
import { EmptyState } from "@/components/general/EmptyState";
import { JobCard } from "@/components/general/JobCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableHead, TableHeader, TableRow ,Table, TableBody, TableCell} from "@/components/ui/table";
import { prisma } from "@/utils/db"
import { requireUser } from "@/utils/requireUser"
import { CopyCheckIcon, MoreHorizontal,PenBoxIcon, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


async function getJobs(userId: string) {
    
    const data=await prisma.jobPost.findMany({
        where:{
            Company:{
                userId:userId
            }
        }
        ,
            select:{
                id:true,
                jobTitle:true,
                status:true,
                createdAt:true,
                Company:{
                    select:{
                        name:true,
                        location:true,
                        logo:true
                    }
                }   
            },
            orderBy:{
                createdAt:"desc"
            }
    })

    return data

}



export default async function JobListings() {
    
        const user=await requireUser()
        const data=await getJobs(user.id)
        console.log(data)
        {
             return (data.length===0) ?
                 <EmptyState title="No Job Posts found" description="You don't have any job posts yet" buttonText="Create a job post now!" href="/post-job"/>:
                 (
                <Card>
                    <CardHeader>
                        <CardTitle>My Jobs</CardTitle>
                        <CardDescription>Manage your listings and applications here</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Logo</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Job Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created at</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    data.map((listing)=>(
                                        <TableRow key={listing.id}>
                                            <TableCell>
                                                <Image src={listing.Company.logo} alt="company_logo" height={48} width={48} className="rounded-md size-10"/>
                                            </TableCell>
                                            <TableCell>{listing.Company.name}</TableCell>
                                            <TableCell>{listing.jobTitle}</TableCell>
                                            <TableCell>{listing.status.charAt(0).toUpperCase()+listing.status.slice(1).toLowerCase()}</TableCell>
                                            <TableCell>{listing.createdAt.toLocaleDateString(
                                                'en-US',
                                                {
                                                    day:"numeric",
                                                    month:"long",
                                                    year:"numeric"
                                                }
                                            )}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/my-jobs/${listing.id}/edit`}>
                                                            <PenBoxIcon/>
                                                            Edit Job
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    
                                                    <CopyLinkMenuItem jobURL={`${process.env.NEXT_PUBLIC_URL}/job/${listing.id}`}/>
                                                    
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/my-jobs/${listing.id}/delete`}>
                                                            <XCircle/>
                                                            Delete Job
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>    
            )
        }
}