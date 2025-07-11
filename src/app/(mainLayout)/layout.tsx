import { AppSidebar } from "@/components/general/sidebar/AppSidebar";
import Navbar from "@/components/general/Navbar";
import { ReactNode } from "react";
export default function Layout({ children }: { children: ReactNode }) {
    return (

            <div className=" px-4 md:px-6 lg:px-8 pb-12">
                
                    <AppSidebar>
                         
                    {children}
                    </AppSidebar>
                
            </div>
        
    )
}