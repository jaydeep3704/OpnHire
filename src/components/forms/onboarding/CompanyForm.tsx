"use client"
import { companySchema } from "@/utils/zodSchema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SelectGroup, SelectLabel } from "@radix-ui/react-select"
import { countryList } from "@/utils/countriesList"
import { Textarea } from "@/components/ui/textarea"
import { UploadDropzone } from "@/components/general/UploadThingReexported"
import { createCompany } from "@/utils/actions"
import { useState } from "react"
import { Loader2, XIcon } from "lucide-react"
import Image from "next/image"
export default function CompanyForm() {

    const form = useForm<z.infer<typeof companySchema>>(
        {
            resolver: zodResolver(companySchema),
            defaultValues: {
                about: '',
                location: '',
                logo: '',
                name: '',
                website: '',
                xAccount: ''
            }
        }
    )

    const [pending, setPending] = useState<boolean>(false)

    const onSubmit = async (data: z.infer<typeof companySchema>) => {
        try {
            setPending(true)
            await createCompany(data);
        } catch (error) {
            if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
                console.log('Something went wrong')
            }
        }
        finally {
            setPending(false)
        }
    }



    return (
        <Form {...form} >
            <form action="" className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={
                            ({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Company Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={
                            ({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Location</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full overflow-hidden">
                                                <SelectValue placeholder="select location" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="w-full">
                                            <SelectGroup>
                                                <SelectLabel>Worldwide</SelectLabel>
                                                <SelectItem value="worldwide"><span>🌍</span><span>WorldWide/Remote</span></SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>Location</SelectLabel>
                                                {
                                                    countryList.map((country) => {
                                                        return (<SelectItem value={country.code} key={country.name}>
                                                            <span >{country.flagEmoji}</span>

                                                            <span >{country.name}</span>
                                                        </SelectItem>)
                                                    })
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
                        name="website"
                        render={
                            ({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Website</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://yourcompany.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }
                    />

                    <FormField
                        control={form.control}
                        name="xAccount"
                        render={
                            ({ field }) => (
                                <FormItem>
                                    <FormLabel>X (Twitter) Account</FormLabel>
                                    <FormControl>
                                        <Input placeholder="@yourcompany" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }
                    />
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name="about"
                        render={
                            ({ field }) => (
                                <FormItem>
                                    <FormLabel>About</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="tell us about your company..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }
                    />
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name="logo"
                        render={
                            ({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Logo</FormLabel>
                                    <FormControl>
                                        <div className="mt-2">
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
                                                         onClick={()=>field.onChange("")}
                                                        ><XIcon/></Button>
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
                </div>
                <Button className='w-full flex items-center justify-center' type="submit" disabled={pending}>
                    {
                        pending ? <Loader2 className="animate-spin" /> : "Continue"
                    }
                </Button>
            </form>
        </Form>
    )
}