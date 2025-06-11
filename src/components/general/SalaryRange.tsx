"use client"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { Control, useController } from "react-hook-form"
import { formatCurrency } from "@/utils/formatCurrency"

interface salaryRangeProps{
    maxSalary:number,
    minSalary:number,
    control:Control,
    step:number,
    currency:string,

}

export default function SalaryRange({maxSalary,minSalary,control,step,currency}:salaryRangeProps ) {

  const {field:fromField}=useController({
    name:'salaryFrom',
    control
  })
  const {field:toField}=useController({
    name:'salaryTo',
    control
  })

  const [range,setRange]=useState<[number,number]>([
    fromField.value || minSalary ,toField.value || maxSalary/2
  ])
  
const handleSliderChange = (newRange: number[]) => {
    const [from, to] = newRange as [number, number]
    setRange([from, to])
    fromField.onChange(from)
    toField.onChange(to)
  }


  return (
   <div className="w-full space-y-6">
    <Slider
      max={maxSalary}
      min={minSalary}
      step={step}
      value={range}
      onValueChange={handleSliderChange}
    />
    <div className="flex justify-between">
        <span>{formatCurrency(range[0])}</span>
        <span>{formatCurrency(range[1])}</span>
    </div>
   </div> 
    
  )
}
