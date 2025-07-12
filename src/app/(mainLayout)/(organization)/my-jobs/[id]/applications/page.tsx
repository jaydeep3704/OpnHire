import { Button, buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/utils/currentUser"
import { prisma } from "@/utils/db"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { MoreHorizontal, UserX } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export async function getApplications(jobId: string) {
    try {
        const applications = await prisma.jobApplication.findMany({
            where: {
                jobPostId: jobId
            },
            include: {
                JobSeeker: {
                    include: {
                        user: true
                    }
                },
            },
        })
        return applications
    } catch (error) {
        throw new Error("Failed to retrieve application")
    }
}




export default async function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
        redirect('/')
    }
    if (user && user.userType == "JOB_SEEKER") {
        redirect('/')
    }
    const applications = await getApplications(id)
    if(applications.length==0){
        return <NoApplicants/>
    }
    return (
        <div>
            <h1 className="text-2xl mb-5 font-semibold">Job Applications</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Applied On</TableHead>
                        <TableHead >Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applications.map((application) => (
                            <TableRow key={application.id}>
                                <TableCell>{application.JobSeeker.name}</TableCell>
                                <TableCell className="text-ellipsis" >{application.JobSeeker.user.email}</TableCell>
                                <TableCell>
                                    <Link
                                        href={application.JobSeeker.resume}
                                        target="_blank"

                                        className={buttonVariants({ variant: 'secondary' })}>
                                        View Resume
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {new Date(application.createdAt).toLocaleDateString('en-US', {
                                        dateStyle: 'medium'
                                    })}
                                </TableCell>
                                <TableCell >
                                    <ActionsDropdown application={application}/>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}


function ActionsDropdown({application}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/profile/${application.JobSeeker.user.id}`}>
                        View Profile
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}



 function NoApplicants() {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center">
      <UserX className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2 text-muted-foreground">No Applicants Yet</h2>
      <p className="text-muted-foreground max-w-md">
        This job hasn't received any applications yet. You can share the job link to reach more potential candidates.
      </p>
      <Link
        href={'/my-jobs'}
        className={cn(buttonVariants({variant:'default'}),'mt-5')}
      >
        Back to My Job Listings
      </Link>
    </div>
  );
}
