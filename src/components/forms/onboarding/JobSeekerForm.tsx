"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { jobSeekerSchema } from '@/utils/zodSchema'
import { z } from "zod"
import { Textarea } from '@/components/ui/textarea'
import { UploadDropzone } from '@/components/general/UploadThingReexported'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Loader2, XIcon } from 'lucide-react'
import { createJobSeeker } from '@/utils/actions'
import PDF from "@/assets/pdf.png"

export default function JobSeekerForm() {

    const form = useForm<z.infer<typeof jobSeekerSchema>>({
        resolver: zodResolver(jobSeekerSchema),
        defaultValues: {
            name: '',
            about: '',
            resume: ''
        }
    })
    const [pending,setPending]=useState<boolean>(false)
    
    const onSubmit=async(data:z.infer<typeof jobSeekerSchema>)=>{
        try {
            setPending(true)
            await createJobSeeker(data)
        } 
        catch (error) {
             if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
                console.log('Something went wrong')
            }
        }
        finally {
            setPending(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='space-y-6'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={
                            ({field}) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter your full name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }
                    />
                    <FormField
                        control={form.control}
                        name='about'
                        render={
                            ({field}) => (
                                <FormItem>
                                    <FormLabel>Short Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Tell something about yourself'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }
                    />

                   <FormField
                        control={form.control}
                        name="resume"
                        render={
                            ({ field }) => (
                                <FormItem>
                                    <FormLabel>Resume (PDF)</FormLabel>
                                    <FormControl>
                                        <div className="mt-2">
                                            {
                                                field.value ? (
                                                    <div className="relative w-fit">
                                                        <Image 
                                                        src={PDF}
                                                        alt="resume (pdf)"
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
                                                        endpoint="resumeUploader"
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

                    <Button type='submit' className='w-full flex items-center justify-center' disabled={pending}>
                        {
                            pending? <Loader2 className='animate-spin'/> : "Continue"
                        }
                    </Button>
                </div>
            </form>
        </Form>
    )
}