"use client"
import { countryList } from "@/utils/countriesList"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "../ui/select"
import { JobDescriptionEditor } from "../RichTextEditor/JobDescriptionEditor"
import { BenefitsSelector } from "../general/BenefitsSelector"
import { Button } from "../ui/button"
import Image from "next/image"
import { Loader2, XIcon } from "lucide-react"
import { UploadDropzone } from "../general/UploadThingReexported"
import { JobListingDurationSelector } from "../general/JobListingDurationSelector"
import {z} from "zod"
import { jobSchema } from "@/utils/zodSchema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import SalaryRange from "../general/SalaryRange"
import { Textarea } from "../ui/textarea"
import { editJobPost } from "@/utils/actions"

interface iAppProps{
    jobPost: {
    jobTitle: string;
    employmentType: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
    jobDescription: string;
    listingDuration: number;
    benefits: string[];
    id: string;
    Company: {
        location: string;
        name:string;
        website:string;
        xAccount: string | null;
        logo:string;
        about:string;
    };
   }
}


export function EditJobForm({jobPost}:iAppProps){
    const form = useForm<z.infer<typeof jobSchema>>({
        defaultValues: {
            benefits: jobPost.benefits || [],
            companyAbout: jobPost.Company.about,
            companyLocation: jobPost.Company.location,
            companyLogo: jobPost.Company.logo,
            companyName: jobPost.Company.name,
            companyWebsite: jobPost.Company.website,
            companyXAccount: jobPost.Company.xAccount || "",
            employmentType: jobPost.employmentType,
            jobDescription: jobPost.jobDescription,
            jobTitle: jobPost.jobTitle,
            listingDuration: jobPost.listingDuration,
            location: jobPost.location,
            salaryFrom: jobPost.salaryFrom,
            salaryTo: jobPost.salaryTo,
        },
        resolver: zodResolver(jobSchema)
    })
    
    const [pending,setPending]=useState<boolean>(false)

    async function onSubmit(data:z.infer<typeof jobSchema>){
        console.log(data)
        try {
          setPending(true)
          await editJobPost(data,jobPost.id)
            
        } catch (error) {
            if(error instanceof Error && error.message!="NEXT_REDIRECT"){
                console.log("Something went wrong")
            }
        }
        finally{
            setPending(false)
        }
    }

    return (
        <Form {...form}>
            <form className=" col-span-1 lg:col-span-2 flex flex-col gap-8" onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Job Information</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="jobTitle"
                                render={({ field }) =>
                                (
                                    <FormItem>
                                        <FormLabel>Job Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="job title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                                }
                            />
                            <FormField
                                control={form.control}
                                name="employmentType"
                                render={({ field }) =>
                                (
                                    <FormItem>
                                        <FormLabel>Employment Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Employment Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Employment Type</SelectLabel>
                                                    <SelectItem value="full-time">Full Time</SelectItem>
                                                    <SelectItem value="part-time">Part Time</SelectItem>
                                                    <SelectItem value="contract">Contract</SelectItem>
                                                    <SelectItem value="internship">Internship</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )
                                }
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) =>
                                (
                                    <FormItem>
                                        <FormLabel>Select Location</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Location" />
                                                </SelectTrigger>
                                            </FormControl>
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
                                        <FormMessage />
                                    </FormItem>
                                )
                                }
                            />

                            <FormItem>
                                <FormLabel>Salary Range</FormLabel>
                                <FormControl>
                                    <SalaryRange
                                        control={form.control}
                                        currency="USD"
                                        minSalary={10000}
                                        maxSalary={1000000}
                                        step={2000}
                                    />

                                </FormControl>
                            </FormItem>
                        </div>
                        <FormField
                            name="jobDescription"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Description</FormLabel>
                                    <FormControl>
                                        <JobDescriptionEditor field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="benefits"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Benefits</FormLabel>
                                    <FormControl>
                                        <BenefitsSelector field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter Company Name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="companyLocation"
                                render={({ field }) =>
                                (
                                    <FormItem>
                                        <FormLabel>Company Location</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Company Location" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Worldwide</SelectLabel>
                                                    <SelectItem value="worldwide"><span>🌍</span><span>Worldwide/Remote</span></SelectItem>

                                                </SelectGroup>
                                                <SelectSeparator />
                                                <SelectGroup>
                                                    <SelectLabel>Company Location</SelectLabel>
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
                                        <FormMessage />
                                    </FormItem>
                                )
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="companyWebsite"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Website</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter Company Website" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="companyXAccount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company X account</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Company X (Twitter) account" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="companyAbout"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="say something about your company"
                                            className="min-h-[120px]" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* company logo    */}
                        <FormField
                            control={form.control}
                            name="companyLogo"
                            render={
                                ({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Logo</FormLabel>
                                        <FormControl>
                                            <div >
                                                {
                                                    field.value ? (
                                                        <div className="relative w-fit">
                                                            <Image
                                                                src={field.value}
                                                                alt="company logo"
                                                                width={100}
                                                                height={100}
                                                                className="rounded-lg"
                                                            />
                                                            <Button className="absolute -top-2 -right-2 " type="button"
                                                                variant="destructive" size="icon"
                                                                onClick={() => field.onChange("")}
                                                            ><XIcon /></Button>
                                                        </div>
                                                    ) :
                                                        <UploadDropzone
                                                            endpoint="imageUploader"
                                                            onClientUploadComplete={(res) => {
                                                                console.log(res[0].url)
                                                                field.onChange(res[0].ufsUrl)
                                                            }}
                                                            onUploadError={() => console.log("Something went wrong")}
                                                            className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary
                                                                                     ut-uploading:ut-button:bg-primary/80"
                                                        />

                                                }
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }
                        />
                    </CardContent>
                </Card>
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>
                            Job Listing Duration
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="listingDuration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <JobListingDurationSelector field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Button type="submit" className="w-full mt-4 flex justify-center items-center">
                    {pending ? <Loader2 className="animate-spin"/>:"Edit Job Post"}
                </Button>
            </form>
        </Form>
    )
}