import { Building2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

type UserSelectionType="company" | "jobSeeker" 
type UserTypeSelectionProps={
    onSelect:(type:UserSelectionType)=>void;
}
export default function UserTypeForm({onSelect}:UserTypeSelectionProps) {
  const buttonBaseStyle = "flex w-full h-auto p-6 items-center gap-4 border-2 rounded-md transition-all duration-200";
  const hoverEffect = "hover:border-primary hover:bg-primary/5";

  return (
    <div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Welcome! Let's get started</h2>
        <p className="text-muted-foreground">Choose how you would like to use our platform</p>
      </div>

      <div className="grid gap-4 mt-6">
        {/* Company/Organization */}
        <button
          onClick={()=>onSelect("company")}
          type="button"
          className={twMerge(buttonBaseStyle, hoverEffect)}
        >
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="size-6 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg">Company/Organization</h3>
            <p>Post jobs and find exceptional talent</p>
          </div>
        </button>

        {/* Job Seeker */}
        <button
          onClick={()=>onSelect("jobSeeker")}
          type="button"
          className={twMerge(buttonBaseStyle, hoverEffect)}
        >
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="size-6 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg">Job Seeker</h3>
            <p>Find your dream job opportunity</p>
          </div>
        </button>
      </div>
    </div>
  );
}
