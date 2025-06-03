import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";


export default function UserTypeForm(){
    return(
        <div>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Welcome ! Lets get started</h2>
                <p className="text-muted-foreground">Choose how you would like to use our platform</p>
            </div>
            <div className="grid gap-4 mt-6">
                <Button 
                variant="outline"
                className="flex w-full h-auto p-6 items-center gap-4  border-2 transition-all duration-200 hover:border-primary hover:bg-primary/5"
                 >
                     <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="size-6 text-primary"/>
                     </div>
                     <div className="text-left">
                        <h3 className="font-semibold text-lg">Company/Organization</h3>
                        <p>Post jobs and find exceptional talent</p>
                     </div>
                </Button>

                
                <Button 
                variant="outline"
                className="flex w-full h-auto p-6 items-center gap-4  border-2 transition-all duration-200 hover:border-primary hover:bg-primary/5"
                 >
                     <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="size-6 text-primary"/>
                     </div>
                     <div className="text-left">
                        <h3 className="font-semibold text-lg">Job Seeker</h3>
                        <p>Find your dream job opportunity</p>
                     </div>
                </Button>
            </div>
        </div>
    )
}

