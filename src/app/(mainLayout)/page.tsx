import { Card, CardHeader, CardTitle } from "@/components/ui/card"


const page = () => {
  return (
    <div className="grid grid-cols-3 gap-8">
      <Card className="col-span-3 md:col-span-1">
          <CardHeader>
             <CardTitle className="text-2xl font-semibold">Filters</CardTitle>
          </CardHeader>
      </Card>
      <Card className="col-span-3 md:col-span-2">

      </Card>
    </div>
  )
}

export default page
