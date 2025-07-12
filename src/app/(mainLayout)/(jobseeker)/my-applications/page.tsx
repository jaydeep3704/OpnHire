import { CopyLinkMenuItem } from "@/components/general/CopyLinkMenuItem"
import { EmptyState } from "@/components/general/EmptyState"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableBody,
  TableCell
} from "@/components/ui/table"
import { getCurrentUser } from "@/utils/currentUser"
import { prisma } from "@/utils/db"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MoreHorizontal, PenBoxIcon } from "lucide-react"

async function getJobApplications(userId: string) {
  const data = await prisma.jobSeeker.findMany({
    where: {
      userId: userId
    },
    select: {
      id: true,
      JobApplications: {
        select: {
          createdAt: true, // Applied at
          JobPost: {
            select: {
              id: true,
              jobTitle: true,
              status: true,
              Company: {
                select: {
                  name: true,
                  logo: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return data
}

export default async function MyApplicationsPage() {
  const user = await getCurrentUser()

  // ✅ Fix for null check and user type
  if (!user || user.userType !== "JOB_SEEKER") {
    redirect("/")
  }

  const data = await getJobApplications(user.id)
  const applications = data[0]?.JobApplications || []

  return applications.length === 0 ? (
    <EmptyState
      title="No Applications Found"
      description="You haven't applied to any jobs yet."
      buttonText="Browse Jobs"
      href="/"
    />
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>My Applications</CardTitle>
        <CardDescription>Review the jobs you've applied to</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app, idx) => {
              const job = app.JobPost
              const company = job.Company

              return (
                <TableRow key={job.id}>
                  <TableCell>
                    <Image
                      src={company.logo}
                      alt="company_logo"
                      width={48}
                      height={48}
                      className="rounded-md size-10"
                    />
                  </TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{job.jobTitle}</TableCell>
                  <TableCell>
                    {job.status.charAt(0).toUpperCase() +
                      job.status.slice(1).toLowerCase()}
                  </TableCell>
                  <TableCell>
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/job/${job.id}`}>
                            <PenBoxIcon className="mr-2 h-4 w-4" />
                            View Job
                          </Link>
                        </DropdownMenuItem>
                        <CopyLinkMenuItem
                          jobURL={`${process.env.NEXT_PUBLIC_URL}/job/${job.id}`}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
