

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import React from "react"
import { AppSidebarClient } from "./_AppSidebarClient"
import { NavUser } from "./nav-user"
import Navbar from "../Navbar"
import { getCurrentUser } from "@/utils/currentUser"
import { JobSeekerSidebarMenu } from "./sidebar-jobseeker"
import {  OrganizationSidebarMenu } from "./sidebar-organization"


export async function AppSidebar({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser({ redirectOnFail: false })
    return (
        <SidebarProvider className="overflow-y-hidden">
            <AppSidebarClient>

                <Sidebar collapsible="icon" className="overflow-hidden">
                    <SidebarHeader className="flex items-center flex-row">
                        <SidebarTrigger size="lg" />
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-black dark:text-white text-no">Opn
                                <span className="text-primary">Hire</span></span>
                        </div>
                    </SidebarHeader>
                    <SidebarContent className="p-2">
                        {
                            user && user.userType==="JOB_SEEKER" ?
                            <JobSeekerSidebarMenu/>: <OrganizationSidebarMenu/>
                        }
                    </SidebarContent>
                    {user && 
                    <SidebarFooter>
                        <NavUser user={user} />
                    </SidebarFooter>}
                </Sidebar>
                <main className="flex-1 max-w-7xl mx-auto">
                    <Navbar />
                    {children}
                </main>
            </AppSidebarClient>
        </SidebarProvider>
    )
}