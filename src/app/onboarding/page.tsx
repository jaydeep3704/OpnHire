import OnBoardingForm from "@/components/forms/onboarding/OnBoardingForm"
import { prisma } from "@/utils/db"
import { requireUser } from "@/utils/requireUser"
import { redirect } from "next/navigation"

async function checkIfUserHasFinishedOnBoarding(userId:string){
  const user=await prisma.user.findUnique({
      where:{
        id:userId
      },
      select:{
        onboardingCompleted:true
      }
    })
   if(user.onboardingCompleted===true){
     return redirect("/")
   } 
   return user;
}

const page = async () => {
  const user=await requireUser()
  await checkIfUserHasFinishedOnBoarding(user.id)
  return (
    <div className="min-h-screen w-full justify-center items-center flex flex-col gap-6">
       <OnBoardingForm/>
    </div>
  )
}

export default page
