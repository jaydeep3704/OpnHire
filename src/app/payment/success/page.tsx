import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/utils/requireUser";
import { Check } from "lucide-react";
import Link from "next/link";

export default async function PaymentSuccess(){
    await requireUser()
    return(
        <div className="w-full min-h-screen flex flex-1 justify-center items-center">
            <Card className="w-[350px]"> 
                <div className="p-6">
                    <div className="w-full flex justify-center ">
                    <Check className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full"/>
                    </div>
                <div className="mt-3 text-center  w-full">
                    <h2 className="text-xl font-semibold">Payment Successfull</h2>
                    <p className="text-sm text-muted-foreground mt-2 tracking-tight text-balance">Congrats your payment was successfull. Your job posting is now active!</p>
                <Button className="mt-5 w-full" asChild >
                    <Link href={"/"}>Go back to homepage</Link>
                </Button>
                </div>
                </div>
            </Card>
        </div>
    )
}