"use client"
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebarClient({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile()
    if (isMobile) {
        return (
            <div className="flex flex-col w-full">
                <div className="flex-1">
                    {children}
                </div>

            </div>
        )
    }
    return children
}