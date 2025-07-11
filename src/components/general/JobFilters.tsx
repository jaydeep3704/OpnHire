"use client"
import { XIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "../ui/select";
import { countryList } from "@/utils/countriesList";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const jobTypes = ["full-time", "part-time", "contract", "internship"]

export function JobFilters() {
    const router=useRouter()
    const searchParams=useSearchParams()
    //get current filters from URL
    const currentJobTypes=searchParams.get("jobTypes")?.split(",") || [];
    const currentLocation=searchParams.get("location")||''
    function clearAllFilters(){
        router.push("/")
    }

    const createQueryString=useCallback((name:string,value:string)=>{
         const params=new URLSearchParams(searchParams.toString())
         if(value){
            params.set(name,value)
         }
         else{
            params.delete(name)
         }
         return params.toString()
    },[searchParams])

    function handleJobTypeChange(jobType:string,checked:boolean){
        const current=new Set(currentJobTypes)
        if(checked){
            current.add(jobType)
        }
        else{
            current.delete(jobType)
        }
        
        const newValue=Array.from(current).join(',')
        
        router.push(`?${createQueryString('jobTypes',newValue)}`)
    }
    
    return (
        <Card className="col-span-1 h-fit">
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-2xl font-semibold">Filters</CardTitle>
                <Button variant="default" size="sm" className="h-8 flex items-center" onClick={clearAllFilters}>
                    <span>Clear all</span>
                    <XIcon />
                </Button>
            </CardHeader>
            <Separator className="mb-4"/>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Label className="text-lg font-semibold">Job Type</Label>
                    <div className="grid grid-cols-2 gap-4">
                        {
                            jobTypes.map((job, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Checkbox id={job} checked={currentJobTypes.includes(job)} 
                                    onCheckedChange={(checked)=>{
                                        handleJobTypeChange(job,checked as boolean)
                                    }}/>
                                    <Label htmlFor={job} className="text-sm font-medium">{job}</Label>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <Label className="text-lg font-semibold">Location</Label>
                    <Select 
                    value={currentLocation} 
                    onValueChange={(value)=>{
                            router.push(`?${createQueryString('location',value)}`)
                    }}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Location"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Worldwide</SelectLabel>
                                <SelectItem value="worldwide"><span>🌍</span><span>Worldwide/Remote</span></SelectItem>

                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                                <SelectLabel>Location</SelectLabel>
                                {
                                    countryList.map((country) => (
                                        <SelectItem value={country.name} key={country.code}>
                                            <span>{country.flagEmoji}</span>
                                            <span>{country.name}</span>
                                        </SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>

                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}