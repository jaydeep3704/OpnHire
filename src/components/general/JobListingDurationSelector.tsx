import { ControllerRenderProps } from "react-hook-form";
import { Label  } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { jobListingDurationPricing } from "@/utils/jobListingDurationSelector";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

interface iAppProps{
    field:ControllerRenderProps
}

export function JobListingDurationSelector({field}:iAppProps){
    return(
        <RadioGroup value={field.value?.toString()} onValueChange={(value)=>field.onChange(parseInt(value))}>
            <div className="flex flex-col gap-4 ">
                {
                    jobListingDurationPricing.map((duration)=>(
                        <div key={duration.days} className="relative ">
                                <RadioGroupItem value={duration.days?.toString()} id={duration.days?.toString()} className="sr-only"/>
                                <Label className="flex flex-col cursor-pointer" htmlFor={duration.days?.toString()}>
                                    <Card className={cn(field.value===duration.days ? "border-primary bg-primary/10":"hover:bg-secondary/50","p-4 border-2 transition-all w-full") }>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{duration.days} Days</p>
                                                <p className="text-sm text-muted-foreground">{duration.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-xl">${duration.price}</p>
                                                <p className="text-sm text-muted-foreground">${(duration.price/duration.days).toFixed(2)}/day</p>
                                            </div>
                                        </div>
                                    </Card>
                                </Label>
                        </div>
                    ))
                }
            </div>
        </RadioGroup>
    )
}