import { JobFilters } from "@/components/general/JobFilters"
import { JobListings } from "@/components/general/JobListings"
import { JobListingLoading } from "@/components/general/skeleton/JobListingLoading"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"
type searchParams={
  searchParams:Promise<{
    page:string
  }>
}

const page =async ({searchParams}:searchParams) => {
  const params=await searchParams
  const currentPage=Number(params.page) || 1
  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-3 md:col-span-1">
         <JobFilters/>
      </div>
      <div className="col-span-3 md:col-span-2">
        <Suspense fallback={<JobListingLoading/>} key={currentPage}>
          <JobListings currentPage={currentPage}/>
        </Suspense>
      </div>
    </div>
  )
}

export default page


