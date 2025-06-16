import { prisma } from "@/utils/db";
import { stripe } from "@/utils/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";


export async function POST(req:Request){
    const body=await req.text();
    const headersList=await headers();
    const signature=headersList.get('Stripe-Signature')
    let event:Stripe.Event;
    try {
        event=stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.WEBHOOK_SECRET
        )
    } catch (error) {
        return new Response('Webhook Error',{status:400})
    }

    const session=event.data.object as Stripe.Checkout.Session;
    if(event.type==="checkout.session.completed"){
        const customerId=session.customer;
        const jobId=session.metadata?.jobId
        if (!jobId) {
            return new Response("No jobId found",{status:400})
        }
        const company=await prisma.user.findUnique({
            where:{
                stripeCustomerId:customerId as string
            },
            select:{
                company:{
                    select:{
                        id:true
                    }
                }
            }
        })
        await prisma.jobPost.update({
            where:{
                id:jobId,
                companyId:company.company.id as string,
            },
            data:{
                status:"ACTIVE"
            }
        })
    }
    return new Response(null,{status:200})
}