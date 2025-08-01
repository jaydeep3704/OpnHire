import { JobFilters } from "@/components/general/JobFilters"
import { JobListings } from "@/components/general/JobListings"
import { JobListingLoading } from "@/components/general/skeleton/JobListingLoading"
import { Suspense } from "react"
type searchParams={
  searchParams:Promise<{
    page?:string,
    jobTypes?:string,
    location?:string
  }>
}

const page =async ({searchParams}:searchParams) => {
  const params=await searchParams
  const currentPage=Number(params.page) || 1
  const jobTypes=params.jobTypes && params.jobTypes.split(',') || []
  const location=params.location || ""
  const filterKey=`page=${currentPage};types=${jobTypes.join(',')};location=${location}`
  console.log(location)
  return (
    <div className="grid grid-cols-3 gap-8 ">
      <div className="col-span-3 md:col-span-1">
         <JobFilters/>
      </div>
      <div className="col-span-3 md:col-span-2">
        <Suspense fallback={<JobListingLoading/>} key={filterKey}>
          <JobListings currentPage={currentPage} jobTypes={jobTypes} location={location}/>
        </Suspense>
      </div>
    </div>
  )
}

export default page


