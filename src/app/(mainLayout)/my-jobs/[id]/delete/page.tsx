import { GeneralSubmitButton } from "@/components/general/SubmitButton";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/utils/requireUser";
import { ArrowLeft, TrashIcon } from "lucide-react";
import Link from "next/link";

export default async function DeleteJob(){

    await requireUser()

    return(
        <div >
        <Card className="max-w-lg mx-auto mt-24">
            <CardHeader>
                <CardTitle>Are you absolutely sure</CardTitle>
                <CardDescription>This action cannot be undone. This will permanently remove your job Listing and permanently delete all of your Job data from our servers.</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
                <Link href={"/my-jobs"} className={buttonVariants({variant:"secondary"})}>
                    <ArrowLeft/>
                    Cancel
                </Link>
                <form >
                    <GeneralSubmitButton text="Delete Job" variant="destructive" icon={<TrashIcon/>}/>
                </form>
            </CardFooter>
        </Card>
        </div>
    )
}