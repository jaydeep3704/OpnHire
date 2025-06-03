"use client"
import Logo from "@/assets/logo.png"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import UserTypeForm from "./UserTypeForm"

type UserSelectionType="company" | "jobSeeker" | null

const OnBoardingForm = () => {
    const [step,setStep]=useState<number>(1)
    const [userType,setUserType]=useState<UserSelectionType>(null)
    const handleUserTypeSelection=(type:UserSelectionType)=>{
        setUserType(type);
        setStep(2)
    }
    
    const renderStep=()=>{
        switch(step){
            case 1:
                return <UserTypeForm/>
            case 2:
                return userType=="company" ? <p>User is a company</p> : <p>User is an individual</p>
            default:
                return null
        }
    }

    return (
    <>
        <div className="flex gap-4  mb-10 items-center">
            <Image src={Logo} alt="opn hire logo" width={50} height={50}/>
            <h1 className="text-4xl font-bold">Opn<span className="text-primary">Hire</span></h1>
        </div>
        <Card className="max-w-lg w-full">
            <CardContent className="p-6">
                {renderStep()}
            </CardContent>
        </Card>
    </>
    
  )
}

export default OnBoardingForm
