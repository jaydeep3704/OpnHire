import { JobFilters } from "@/components/general/JobFilters"
import { JobListings } from "@/components/general/JobListings"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"


const page = () => {
  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-3 md:col-span-1">
         <JobFilters/>
      </div>
      <div className="col-span-3 md:col-span-2">
          <JobListings/>
      </div>
    </div>
  )
}

export default page
