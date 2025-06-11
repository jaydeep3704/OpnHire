
import { benefits } from "@/utils/benefitsList"
import { Badge } from "../ui/badge"
import { ControllerRenderProps } from "react-hook-form"

interface iAppProps{
    field:ControllerRenderProps
}


export function BenefitsSelector({field}:iAppProps){
    
    function toggleBenefit(benefitId:string){
        const currentBenefits=field.value || []
        const newBenefits= currentBenefits.includes(benefitId)? currentBenefits.filter((id:string)=>id!==benefitId) : [...currentBenefits,benefitId]
        field.onChange(newBenefits)
    }
    
    return(
        <div>
            <div className="flex flex-wrap gap-3">
                {
                    benefits.map((benefit)=>{
                    const isSelected=(field.value || []).includes(benefit.id);
                    return (<Badge 
                    key={benefit.id} 
                    variant={isSelected?"default":"outline"} 
                    className="cursor-pointer transition-all hover:scale-105 active:scale-95 
                    py-1.5 px-4 rounded-full" 
                    onClick={()=>toggleBenefit(benefit.id)}
                    >
                        <span className="flex gap-2 items-center">
                            {benefit.icon}
                            {benefit.label}
                        </span>
                    </Badge>)}
                    )
                }
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
                Selected Benefits : <span className="text-primary">{ (field.value || []).length}</span>
            </div>
        </div>
    )
}